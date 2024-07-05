using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoan.Models
{
    [Table("Customer", Schema = "dbo")]
    public class Customer
    {        
        [Key]
        [Column(TypeName = "int")]
        public int CustomerId { get; set; }
        [Column(TypeName = "varchar(500)")]
        public string Name { get; set; }
        [Column(TypeName = "varchar(20)")]
        public string Email { get; set; }
        [Column(TypeName = "varchar(20)")]
        public string PhoneNumber { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Address { get; set; }
        [Column(TypeName = "decimal(10,2")]
        public decimal Balance { get; set; }
        [Column(TypeName = "decimal(10,2")]
        public decimal LoanAmount { get; set; }
        [Column(TypeName = "decimal(10,2")]
        public decimal Outstanding { get; set; }
        [Column(TypeName = "int")]
        public int Tenor { get; set; }
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime DueDate { get; set; }
        [Column(TypeName = "decimal(10,2")]
        public decimal InterestRate { get; set; }
        [Column(TypeName = "decimal(10,2")]
        public decimal PenaltyRate { get; set;}
    }
}
