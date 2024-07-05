using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoan.Models
{
    [Table("CreditLoanDetail", Schema = "dbo")]
    public class CreditLoanDetail
    {
        [Key]
        [Column(TypeName = "int")]
        public int Id { get; set; }
        [Column(TypeName = "int")]
        public int CustomerId { get; set; }
        [Column(TypeName = "int")]
        public int RowNo{ get; set; }
        //[DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime DueDate { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal MainAmount { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal InterestAmount { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal RemainingAmount { get; set; }
        [Column(TypeName = "varchar(20)")]
        public string? PaymentStatus { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string? PaymentId { get; set; }
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime PaymentDate { get; set; }
    }
}

