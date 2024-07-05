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
using CreditLoan.Dtos;

namespace CreditLoan.Controllers
{
    [ApiController]
    [Route("creditloans")]
    public class LoginControllers : ControllerBase
    {
        private ILogger<LoginControllers> _logger;
        private readonly ILoginService _loginService;
        private readonly ITokenService _tokenService;
        public LoginControllers(ILogger<LoginControllers> logger, ILoginService loginService) 
        {
            _logger = logger;
            _loginService = loginService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            _logger.LogInformation(String.Format(">>> Login Start at {0} <<<", DateTime.Now.ToString()));
            try
            {
                var result = new JObject();
                //if (!ModelState.IsValid)
                //    return BadRequest(ModelState);
                
                LoginInfoDto action = _loginService.Login(login);
                if(action.Message=="success")
                {
                    return Ok(ApiResult.success(200, "Login Success",action.Login));
                    
                }
                else 
                    return BadRequest(ApiResult.failed(400,action.Message));

            }
            catch (Exception ex)
            {
                _logger.LogError($"Login Error: {ex.Message}");
                return BadRequest(ApiResult.failed(400, $"Exception: {ex.Message}"));
            }
            finally
            {
                _logger.LogInformation(String.Format(">>> Login End at {0} <<<", DateTime.Now.ToString()));

            }


        }
      
    }
}
