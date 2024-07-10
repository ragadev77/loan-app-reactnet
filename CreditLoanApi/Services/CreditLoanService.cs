using CreditLoan.Dtos;
using CreditLoan.Models;
using CreditLoanApi.Dtos;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using CreditLoanApi.Repositories;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;
using Newtonsoft.Json.Linq;
using System;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Reflection.Metadata;

namespace CreditLoanApi.Services
{
    public class CreditLoanService : ICreditLoanService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ICreditLoanDetailRepository _detailRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly ILogger<CreditLoanService> _logger;
        public CreditLoanService(ICreditLoanDetailRepository loanAccountDetailRepository, IPaymentRepository paymentRepository,
            ICustomerRepository customerRepository, ILogger<CreditLoanService> logger) 
        {
            _paymentRepository = paymentRepository;
            _detailRepository = loanAccountDetailRepository;
            _customerRepository = customerRepository;
            _logger = logger;
        }
        
        public List<CustomerLoanDto> GetCustomerLoansByPeriod(int month, int year, int page, int pageSize)
        {
            List<CustomerLoanDto> result = null;
            try
            {
                int rowNo = 0;
                var customer = _customerRepository.List().Result;
                var details = _detailRepository.List().Result;
                var join = from cust in customer
                                join loan in details
                                on cust.CustomerId equals loan.CustomerId
                                   // where loan.PaymentDate.Month.Equals(month) && loan.PaymentDate.Year.Equals(year)
                            select new CustomerLoanDto
                                {
                                    RowId = cust.CustomerId + loan.RowNo.ToString(),
                                    CustomerId = cust.CustomerId,
                                    CustomerName = cust.Name,
                                    LoanAmount = cust.LoanAmount,
                                    Balance = cust.Balance,
                                    Outstanding = cust.Outstanding,
                                    RowNo = loan.RowNo,
                                    DueDate = loan.DueDate,
                                    TotalAmount = loan.TotalAmount,
                                    MainAmount = loan.MainAmount,
                                    InterestAmount = loan.InterestAmount,
                                    RemainingAmount = loan.RemainingAmount,
                                    PaymentId = loan.PaymentId,
                                    PaymentDate =  loan.PaymentDate,
                                    PaymentStatus = loan.PaymentStatus
                                };

                var list = join.ToList();
                if (page == 1)
                {
                    result = list.Take(pageSize).ToList();
                }
                else
                {
                    result = list.Skip((page * pageSize) - pageSize).Take(pageSize).ToList();
                }
                
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Service GetCustomerLoansByPeriod Error: " + ex.Message);
                return result;
            }           

        }
   
        public List<CreditLoanDto> GetListLoan()
        {
            List<CreditLoanDto> result = new List<CreditLoanDto>();
            try
            {
                var customer = _customerRepository.List().Result;                
                if (customer != null)
                {
                    foreach(var item in customer)
                    {
                        var details = _detailRepository.GetByCustomer(item.CustomerId).Result;
                        CreditLoanDto resultChild = new CreditLoanDto()
                        {
                            Customer = item,
                            Details = details
                        };
                        result.Add(resultChild);

                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Service GetListLoan Error: " + ex.Message);
                return null;
            }

            return result;

        }
        public CreditLoanDto GetLoanByCustomer(int customerId)
        {
            CreditLoanDto result = null;
            try
            {
                var customer = _customerRepository.Get(customerId).Result;
                if (customer != null)
                {
                    var details = _detailRepository.GetByCustomer(customerId).Result;
                    result = new CreditLoanDto()
                    {
                        Customer = customer,
                        Details = details
                    };
                }
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Service GetByCustomer Error: " + ex.Message);
                return null;
            }

            return result;

        }

        public CreditLoanDto CreateLoan(LoanRequestDto loanRequest)
        {
            CreditLoanDto result = null;
            bool formulaCreated = false;
            decimal balanceAmt = 0;
            decimal outstandingAmt = 0;
            try
            {

                var cust = _customerRepository.Get(loanRequest.CustomerId).Result;
                if (cust != null)
                {
                    /* save detail */
                    formulaCreated = createSimulationFormula(loanRequest, cust.CustomerId, out balanceAmt, out outstandingAmt);
                    /* iupdate customer header field */
                    cust.Balance = balanceAmt;
                    cust.LoanAmount = loanRequest.LoanAmount;
                    cust.Outstanding = outstandingAmt;
                    cust.Tenor = loanRequest.Tenor;                    
                    cust.DueDate = loanRequest.LoanDate.AddMonths(1);
                    cust.InterestRate = loanRequest.InterestRate;
                    cust.PenaltyRate = loanRequest.InterestRate;
                    int custUpdate = _customerRepository.Update(cust).Result;

                    return GetLoanByCustomer(loanRequest.CustomerId);
                }
                return result;

            }
            catch (Exception ex)
            {
                _logger.LogError($">>> LoanAccountService.SimulateLoan Error: {ex.Message} <<<");
                return result;
            }
        }

        public bool createSimulationFormula(LoanRequestDto header, int custId, out decimal balance, out decimal outstanding)
        {
            /** result variables **/
            List<CreditLoanDetail> listDetail = new List<CreditLoanDetail>();
            int detailSave = 0;
            bool result = false;
            balance = 0; outstanding = 0;
            int mon = 1;

            /** formula variables **/
            decimal plf = header.LoanAmount;
            decimal sb = header.InterestRate;
            decimal tenor = header.Tenor;

            decimal sb_plf = sb * plf;
            decimal sb12 = sb / tenor;
            decimal i1 = 1 + sb12;
            decimal x = (decimal)Math.Pow((double)i1, (double)tenor);
            decimal y = x - 1;
            decimal TP = (sb_plf * x) / y;
            decimal TA = TP / tenor;

            decimal[] AB = new decimal[(int)tenor];
            decimal[] AP = new decimal[(int)tenor];
            decimal[] REM = new decimal[(int)tenor];

            for (int i = 0; i <= (int)tenor - 1; i++)
            {
                CreditLoanDetail detail = new CreditLoanDetail();
                if (i == 0)
                {
                    AB[i] = (plf / tenor) * sb;
                    AP[i] = TA - AB[i];
                    REM[i] = plf - AP[i];
                    outstanding = REM[i];
                }
                else
                {
                    AB[i] = (REM[i - 1] / tenor) * sb;
                    AP[i] = TA - AB[i];
                    REM[i] = REM[i - 1] - AP[i];
                }

                detail.CustomerId = custId;
                detail.RowNo = i + 1;
                detail.TotalAmount = TA;
                detail.MainAmount = AP[i];
                detail.InterestAmount = AB[i];
                detail.RemainingAmount = REM[i];
                detail.PaymentStatus = "outstanding";
                detail.PaymentDate = DateTime.ParseExact("1900-01-01", "yyyy-MM-dd", CultureInfo.InvariantCulture);
                //detail.DueDate = i == 0 ? detail.DueDate = header.LoanDate.AddMonths(mon) : detail.DueDate = header.LoanDate.AddMonths(i);
                detail.DueDate = header.LoanDate.AddMonths(i + 1);


                balance += TA;

                listDetail.Add(detail);

                /* save detail */
                detailSave += _detailRepository.Add(detail).Result;
            } // end for

            if (detailSave == tenor)
                result = true;

            return result;
        }

        public IEnumerable<T> ReadCSV<T>(Stream file)
        {
            var reader = new StreamReader(file);
            var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

            var records = csv.GetRecords<T>();
            return records;
        }

        public List<PaymentDto> ReadFileFromFtp(out string message)
        {
            List<PaymentDto> result = null;
            message = "failed";
            try
            {
                string urlFtp = "ftp://192.168.137.163:21/";
                string folder = "inbound";
                string file = "cust-payment.csv";

                FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{urlFtp}/{folder}/{file}");

                request.Method = WebRequestMethods.Ftp.DownloadFile;

                //request.Credentials = new NetworkCredential("ftpuser", "ftppwd");

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();

                Stream responseStream = response.GetResponseStream();
                result = (List<PaymentDto>) ReadCSV<PaymentDto>(responseStream);

                message = "success";
                return result;
            }
            catch (Exception ex)
            {
                message = ex.Message;
                return null;
            }

        }

        public IEnumerable<T> ReadFileFromFtp<T>(out string message)
        {
            IEnumerable<PaymentDto> result = null;
            message = "failed";
            try
            {
                string urlFtp = "ftp://192.168.137.163:21/";
                string folder = "inbound";
                string file = "cust-payment.csv";

                FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{urlFtp}/{folder}/{file}");

                request.Method = WebRequestMethods.Ftp.DownloadFile;

                //request.Credentials = new NetworkCredential("ftpuser", "ftppwd");

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();

                Stream responseStream = response.GetResponseStream();
                result = ReadCSV<PaymentDto>(responseStream);

                message = "success";
                return (IEnumerable<T>)result;
            }
            catch(Exception ex)
            {
                message = ex.Message;
                return null;
            }

        }

        static void downloadFtpFilesDirectory(string url, NetworkCredential credentials, string localPath)
        {
            FtpWebRequest listRequest = (FtpWebRequest)WebRequest.Create(url);
            listRequest.Method = WebRequestMethods.Ftp.ListDirectoryDetails;
            listRequest.Credentials = credentials;
            List<string> lines = new List<string>();
            using (FtpWebResponse listResponse = (FtpWebResponse)listRequest.GetResponse())
            using (Stream listStream = listResponse.GetResponseStream())
            using (StreamReader listReader = new StreamReader(listStream))
            {
                while (!listReader.EndOfStream)
                {
                    lines.Add(listReader.ReadLine());
                }
            }

            foreach (string line in lines)
            {
                string[] tokens =
                    line.Split(new[] { ' ' }, 4, StringSplitOptions.RemoveEmptyEntries);
                string name = tokens[3];
                string permissions = tokens[2];

                string fileUrl = url + name;

                if (permissions[1] == 'D')
                {
                    // line contains Directory
                    string localFilePath = Path.Combine(localPath, name);
                    //recursive function
                    downloadFtpFilesDirectory(fileUrl + "/", credentials, localFilePath);
                }
                else
                {
                    // line contains file
                    FtpWebRequest downloadRequest = (FtpWebRequest)WebRequest.Create(fileUrl);
                    downloadRequest.Method = WebRequestMethods.Ftp.DownloadFile;
                    downloadRequest.Credentials = credentials;
                    using (FtpWebResponse downloadResponse =
                              (FtpWebResponse)downloadRequest.GetResponse())
                    using (Stream sourceStream = downloadResponse.GetResponseStream())
                    using (Stream targetStream = File.Create(Path.Combine(localPath, name)))
                    {
                        byte[] buffer = new byte[10240];
                        int read;
                        while ((read = sourceStream.Read(buffer, 0, buffer.Length)) > 0)
                        {
                            targetStream.Write(buffer, 0, read);
                        }
                    }
                }
            }
        }

    }
}
