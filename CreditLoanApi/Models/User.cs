using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoan.Models
{
    [Table("UserLogin", Schema = "dbo")]
    public class User
    {
        [Key]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
