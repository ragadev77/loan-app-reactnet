using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using CreditLoan.Services;
using System.Text;
using CreditLoan.Models;
using CreditLoanApi.Models;
using Newtonsoft.Json.Linq;
using System;
using static System.Collections.Specialized.BitVector32;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Dtos;

namespace CreditLoan.Controllers
{
    [ApiController]
    [Route("creditloans/customer")]
    public class CustomersControllers : ControllerBase
    {
        private ILogger<LoginControllers> _logger;
        private readonly ICustomerService _custService;
        public CustomersControllers(ILogger<LoginControllers> logger, ICustomerService customerService) 
        {
            _logger = logger;
            _custService = customerService;
        }

    
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            _logger.LogInformation(String.Format("[ Get Customer Start at {0}]", DateTime.Now.ToString()));
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {

                var data = await _custService.GetCustomer(id);
                if (data!=null)
                    return Ok(ApiResult.success(200, "Get Success",data));
                else
                    return NotFound(ApiResult.failed(404, "No Data Found"));


            }
            catch (Exception ex)
            {
                _logger.LogError($"Get Failed Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format("[ Get Customer End at {0}]", DateTime.Now.ToString()));
            }
        }

        [HttpPost]
        [Route("list")]
        public async Task<IActionResult> ListCustomer([FromBody] SearchParameterDto searchParameter)
        {
            _logger.LogInformation(String.Format("[ List Customer Start at {0}]", DateTime.Now.ToString()));
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                var data = await _custService.ListCustomer(searchParameter);
                if (data != null)
                    return Ok(ApiResult.success(200, "Data Found", data));
                else
                    return NotFound(ApiResult.failed(404, "No Data Found"));
            }
            catch (Exception ex)
            {
                _logger.LogError($"ListCustomer Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format("[ List Customer End at {0}]", DateTime.Now.ToString()));
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerDto json)
        {
            _logger.LogInformation(String.Format("[ Create Customer Start at {0}]", DateTime.Now.ToString()));
            try
            {
                var result = await _custService.CreateCustomer(json);
                if (result == "success")
                    return Ok(ApiResult.success(200, "Create Success"));
                else
                    return BadRequest(ApiResult.failed(404, result));

            }
            catch (Exception ex)
            {
                _logger.LogError($"Create Customer Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally {
                _logger.LogInformation(String.Format("[ Create Customer End at {0}]", DateTime.Now.ToString()));
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCustomer([FromBody] Customer data)
        {
            _logger.LogInformation(String.Format("[ Update Customer Start at {0}]", DateTime.Now.ToString()));
            try
            {

                if (!ModelState.IsValid)
                    return BadRequest(ApiResult.failed(400, "invalid parameters", ModelState));
                //return BadRequest(ModelState);

                var action = _custService.UpdateCustomer(data).Result;
                if (action == 1)
                    return Accepted(ApiResult.success(202, "Update Success", action));
                else
                    return BadRequest(ApiResult.failed(404, "Update Failed"));

            }
            catch (Exception ex)
            {
                _logger.LogError($"UpdateCustomer Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format("[ Update Customer End at {0}]", DateTime.Now.ToString()));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            _logger.LogInformation(String.Format("[ Delete Customer Start at {0}]", DateTime.Now.ToString()));
            try
            {

                if (!ModelState.IsValid)
                    return BadRequest(ApiResult.failed(400, "invalid parameters", ModelState));

                var action =  _custService.DeleteCustomer(id).Result;
                if (action == 1)
                    return Accepted(ApiResult.success(202, "Delete Success", action));
                else
                    return BadRequest(ApiResult.failed(404, "Delete Failed"));

            }
            catch (Exception ex)
            {
                _logger.LogError($"DeleteCustomer Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format("[ Delete Customer End at {0}]", DateTime.Now.ToString()));
            }
        }

    }
}
