using CreditLoan.Dtos;
using CreditLoan.Models;
using CreditLoanApi.Dtos;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using CreditLoanApi.Repositories;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;
using System;
using System.Data;
using System.Globalization;
using System.Net;
using System.Reflection.Metadata;
using System.Text;

namespace CreditLoanApi.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly ICreditLoanDetailRepository _detailRepository;
        private readonly IConfiguration _configuration;
        private readonly IDbLoggerRepository _dbloggerRepository;

        private readonly ILogger<PaymentService> _logger;
        private byte[] streamInByte;

        public PaymentService(IConfiguration configuration, IPaymentRepository paymentRepository,
            IDbLoggerRepository dbLoggerRepository, ICreditLoanDetailRepository loanAccountDetailRepository, 
            ICustomerRepository customerRepository, ILogger<PaymentService> logger) 
        {
            _dbloggerRepository = dbLoggerRepository;
            _paymentRepository = paymentRepository;
            _configuration = configuration;
            _detailRepository = loanAccountDetailRepository;
            _customerRepository = customerRepository;
            _logger = logger;
        }

        // move to csv service
        public IEnumerable<T> ReadCSV<T>(Stream file)
        {
            _logger.LogInformation(file.ToString());
            var reader = new StreamReader(file);
            var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

            var records = csv.GetRecords<T>();
            _logger.LogInformation(csv.ToString());
            return records;
        }


        List<PaymentDto> ReadStream() 
        {
            try
            {
                string urlFtp = _configuration["FtpUrl"];
                string folder = _configuration["FtpFolder"];
                string file = _configuration["PaymentFile"];
                string usr = _configuration["FtpUser"];
                string pass = _configuration["FtpPass"];
                string access = _configuration["FtpAccess"];
                List<PaymentDto> data = null;

                _logger.LogInformation($"{urlFtp}/{folder}/{file}");
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{urlFtp}/{folder}/{file}");
                request.Method = WebRequestMethods.Ftp.DownloadFile;
                if (access != "anonymous")
                {
                    request.Credentials = new NetworkCredential(usr, pass);
                }
                List<string> lines = new List<string>();
                using (FtpWebResponse listResponse = (FtpWebResponse)request.GetResponse())
                using (Stream listStream = listResponse.GetResponseStream())
                {
                    data = ReadCSV<PaymentDto>(listStream).ToList();

                }
                return data;
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.ToString());
                _logger.LogError(ex.ToString());
                return null;

            }

        }

        public async Task<List<PaymentDtoOut>> SyncPaymentFromFtp()
        {
            List<PaymentDtoOut> outListPayment = null;
            List<PaymentDto> listPayment = null;            
            IEnumerable<PaymentDto> csvListPayment = null;
            try
            {
                listPayment = ReadStream();
                if (listPayment == null)
                    return null;


                int iSave = 0;
                /* save to payment */
                for(int i=0; i< listPayment.Count(); i++)
                {

                    Payment payment = new Payment();
                    payment.PaymentId = listPayment[i].PaymentId;
                    payment.CustomerId = listPayment[i].CustomerId;
                    payment.PaymentAmount = listPayment[i].PaymentAmount;
                    payment.PaymentDate = listPayment[i].PaymentDate;

                    /* only save if paymentId not exist */
                    var oldPay = _paymentRepository.Get(payment.PaymentId).Result;
                    if (oldPay==null)
                    {
                        /* skip if customer id not exist */
                        var checkCust = _customerRepository.Get(payment.CustomerId).Result;
                        if (checkCust == null)
                            continue;

                        /* skip if rowNo not exist */
                        var detail = _detailRepository.GetByCustomerAndRowNo(payment.CustomerId, listPayment[i].InstallmentNo).Result;
                        if (detail== null)
                            continue;
                        else
                        {
                            /* save payment */
                            iSave += _paymentRepository.Create(payment).Result;

                            /* update CreditLoanDetail payment status and detail */
                            detail.PaymentStatus = "paid";
                            detail.PaymentId = payment.PaymentId;
                            detail.PaymentDate = payment.PaymentDate;
                            var saveDetail = _detailRepository.Update(detail).Result;
                        }
                    }

                } // end for

                /* distinct customerId from PaymentDto */
                //var distinctPaymentDto = listPayment.Distinct(new PaymentDtoComparer());

                outListPayment = new List<PaymentDtoOut>();
                foreach(PaymentDto pay in listPayment)
                {
                    PaymentDtoOut outPay = new PaymentDtoOut(){
                        PaymentId = pay.PaymentId,
                        PaymentAmount = pay.PaymentAmount,
                        CustomerId = pay.CustomerId,
                        PaymentDate = pay.PaymentDate
                    };

                    var cust = _customerRepository.Get(pay.CustomerId).Result;

                    /* skip if customer id not exist */
                    if (cust == null)
                    {
                        outPay.Status = "failed";
                        outPay.Message = "invalid customerId";
                        outListPayment.Add(outPay);
                        continue;
                    }

                    var custLoan = _detailRepository.GetByCustomer(pay.CustomerId).Result;

                    /* skip if installment no not exist */
                    var rowNoExist = (from r in custLoan where r.RowNo == pay.InstallmentNo select r);
                    if (rowNoExist == null)
                    {
                        outPay.Status = "failed";
                        outPay.Message = "invalid installmentNo";
                        outListPayment.Add(outPay);
                        continue;
                    }

                    /* update customer : balance, outstanding and next duedate */
                    var nd1 = (from n in custLoan where n.PaymentStatus == "outstanding" orderby n.RowNo select n).First();
                    var sumPaid = (from n in custLoan where n.PaymentStatus == "paid" orderby n.RowNo select n.TotalAmount).Sum();

                    /* balance = cust.LoanAmount - sum(totalAmount) where status = paid */
                    cust.Balance = cust.LoanAmount - sumPaid;
                    cust.Outstanding = nd1.RemainingAmount;
                    cust.DueDate = nd1.DueDate;

                    outPay.Status = "success";
                    outPay.Message = "synced success";
                    outListPayment.Add(outPay);
                    
                    await _customerRepository.Update(cust);
                }

                return outListPayment;
            }
            catch(Exception ex)
            {
                //Console.WriteLine(ex.ToString());
                _logger.LogError(ex.ToString());
                return outListPayment;
            }

        }
        public PaymentCodeDto mapPaymentCode(string _code)
        {
            //// payment code format : pay[installment_rowno]crloan-c[customerId]
            //// i.e : pay12crloan-c25" = payment for installment-12 of customerid : 25
            ///
            string code = _code;
            code = code.Replace("pay", ""); //12crloan-c25
            /* loanCode = from pay12crloan-c25 to crloan-c25 */
            string loan_code = code.Substring(code.IndexOf('c'), code.Length - code.IndexOf('c'));
            code = code.Replace("crloan", ""); //12-c25
            code = code.Replace("c", ""); //12-25
            string[] result = code.Split('-');
            string rowno = result[0];
            string custid = result[1];

            PaymentCodeDto payment = new PaymentCodeDto() { 
                rowNo = int.Parse(rowno),
                customerId = int.Parse(custid),
                loanCode = loan_code 
            };            

            return payment;
        }
     
    }
}
