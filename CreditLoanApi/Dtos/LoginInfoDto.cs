using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoan.Dtos
{
    public class LoginInfoDto
    {
        public string Message { get; set; }
        public LoginDto Login { get; set; }        
    }
}
