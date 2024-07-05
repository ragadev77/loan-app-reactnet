using CreditLoanApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;
using System.Text.Json.Nodes;
using System.Text;
using CreditLoanApi.Interfaces;

namespace CreditLoan.Controllers
{
    [ApiController]
    [Route("creditloans/dblogger")]
    public class DbLoggerController : Controller
    {
        private readonly IDbLoggerRepository _repository;
        public DbLoggerController(IDbLoggerRepository DbLoggerRepository) {
            _repository = DbLoggerRepository;
        }
        [HttpGet]
        public async Task<IActionResult> ListLogger()
        {
            var data = await _repository.ListDbLogger();
            if (data.Any())
                return Ok(data);
            else 
                return BadRequest();

        }

        [HttpPost]
        public ActionResult AddDbLogger([FromBody] DbLogger _dbLogger)
        {
            try
            {
                var response =  _repository.AddDbLogger(_dbLogger);
                if (response == 1)
                    return Ok(response);
                return BadRequest(response);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
