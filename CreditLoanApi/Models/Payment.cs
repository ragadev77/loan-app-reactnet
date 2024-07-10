using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoan.Models
{
    [Table("Payment", Schema = "dbo")]
    public class Payment
    {
        [Key]
        [Column(TypeName = "varchar(50)")]
        public string PaymentId { get; set; }

        [Column(TypeName = "int")]
        public int CustomerId { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal PaymentAmount { get; set; }
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime PaymentDate { get; set; }
        [Column(TypeName = "varchar(20)")]
        public string PaymentStatus { get; set; } = string.Empty;
    }
}
