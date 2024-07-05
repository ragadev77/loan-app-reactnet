using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoan.Models
{
    [Table("CreditLoanHeader", Schema = "dbo")]
    public class CreditLoanHeader
    {
        [Key]
        [Column(TypeName = "int")]
        public int Id { get; set; }
        [Column(TypeName = "int")]
        public int CustomerId { get; set; }
        [Column(TypeName = "varchar(20)")]
        public string? LoanCode { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Plafond { get; set; }
        [Column(TypeName = "int")]
        public int Tenor { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal InterestRate { get; set; }
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime LoanDate { get; set; }
    }
}

