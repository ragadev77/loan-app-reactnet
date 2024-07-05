using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using CreditLoanApi.Models;
using CreditLoan.Services;
using CreditLoan.Models;
using Microsoft.AspNetCore.Http;
using CreditLoanApi.Repositories;
using Microsoft.Extensions.Logging;
using System.Reflection.Metadata.Ecma335;
using System.Data;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Dtos;
using Microsoft.AspNetCore.SignalR.Protocol;
using CreditLoan.Dtos;
using System.Collections.Generic;
using System.Net;
using CsvHelper;
using System.Globalization;

namespace CreditLoan.Controllers
{
    [ApiController]
    [Route("creditloans")]
    public class CreditLoansController : ControllerBase
    {
        private readonly ICreditLoanService _loanService;
        private readonly IPaymentService _paymentService;
        private readonly ICustomerRepository _customerRepository;
        private readonly ICreditLoanDetailRepository _loanRepository;
        private readonly IConfiguration _configuration;

        private ILogger<CreditLoansController> _logger;
        public CreditLoansController( ICreditLoanService loanAccountService, IPaymentService paymentService,
            ICustomerRepository customerRepository, ILogger<CreditLoansController> logger, ICreditLoanDetailRepository loanRepository, IConfiguration configuration)
        {
            _customerRepository = customerRepository;
            _paymentService = paymentService;
            _loanService = loanAccountService;
            _logger = logger;
            _loanRepository = loanRepository;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("report/{customerId}")]
        public async Task<IActionResult> ReportByCustomerId(int customerId)
        {
            _logger.LogInformation(String.Format(">>> GetCreditLoansByCustomerId Start at {0} <<<", DateTime.Now.ToString()));
            try
            {
                var result = _loanService.ReportByCustomer(customerId);
                if (result != null)
                    return Ok(ApiResult.success(200, "Data Found", result));
                else
                {
                    return BadRequest(ApiResult.failed(400, "No Data Found"));
                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"GetCreditLoansByCustomerId Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format(">>> GetCreditLoansByCustomerId End at {0} <<<", DateTime.Now.ToString()));

            }
        }
        [HttpGet]
        [Route("report")]
        public async Task<IActionResult> PaymentReportMonthly([FromQuery] int month, [FromQuery] int year)
        {
            _logger.LogInformation(String.Format(">>> PaymentReportMonthly Start at {0} <<<", DateTime.Now.ToString()));
            try
            {
                var result = _loanService.ReportAll(month, year);                
                if (result != null && result.Count > 0)
                    return Ok(ApiResult.success(200, "Data Found", result));
                else
                {
                    return BadRequest(ApiResult.failed(400, "No Data Found"));
                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"PaymentReportMonthly Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format(">>> PaymentReportMonthly End at {0} <<<", DateTime.Now.ToString()));

            }
        }

        [HttpGet]
        [Route("request/{customerId}")]
        public async Task<IActionResult> GetLoanByCustomer(int customerId)
        {
            _logger.LogInformation(String.Format(">>> GetLoanByCustomer start {0} <<<", DateTime.Now.ToString()));
            try
            {
                var result = _loanService.GetLoanByCustomer(customerId);
                if (result != null)
                    return Ok(ApiResult.success(200, "Data Found", result));
                else
                {
                    return BadRequest(ApiResult.failed(400, "No Data Found"));
                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"GetLoanByCustomer Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format(">>> Simulate Credit Loan end at{0} <<<", DateTime.Now.ToString()));
            }
        }

        [HttpPost]
        [Route("request")]
        public async Task<IActionResult> CreateLoan([FromBody] LoanRequestDto loanRequest)
        {
            _logger.LogInformation(String.Format(">>> Simulate Credit Loan start {0} <<<", DateTime.Now.ToString()));
            try
            {
                /* check if customer exist */
                var cust = _customerRepository.Get(loanRequest.CustomerId).Result;
                if (cust == null)
                    return BadRequest(ApiResult.failed(400, "Customer Not Found"));

                /* check if loan request already made */
                var loan = _loanRepository.GetByCustomer(loanRequest.CustomerId).Result.ToList();
                if (loan.Count() > 0)
                    return BadRequest(ApiResult.failed(400, "Loan Request already exist"));

                var result = _loanService.CreateLoan(loanRequest);
                if (result != null)
                    return Ok(ApiResult.success(200, "Loan Request Saved", result));
                else
                    return BadRequest(ApiResult.failed(400, "Loan Request Failed"));

            }
            catch (Exception ex)
            {
                _logger.LogError($"GetSimulationByCode Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format(">>> Simulate Credit Loan end at{0} <<<", DateTime.Now.ToString()));
            }
        }
        public IEnumerable<T> ReadCSV<T>(Stream file)
        {
            var reader = new StreamReader(file);
            var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

            var records = csv.GetRecords<T>();
            return records;
        }

        [HttpPost]
        [Route("payment")]
        public async Task<IActionResult> SyncPaymentCsv([FromForm] IFormFileCollection file)
        {

            _logger.LogInformation(String.Format(">>> SavePaymentCsv start {0} <<<", DateTime.Now.ToString()));
            try
            {
                var payments = await _paymentService.SyncPaymentFromFtp(); 
                if (payments!=null)
                    return Ok(ApiResult.success(200, "Payment Sync Success", payments));
                else
                    return BadRequest(ApiResult.failed(400, "Payment Sync Failed"));

            }
            catch (Exception ex)
            {
                _logger.LogError($"SavePaymentCsv Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format(">>> SavePaymentCsv end at{0} <<<", DateTime.Now.ToString()));
            }

        }


    }

}

