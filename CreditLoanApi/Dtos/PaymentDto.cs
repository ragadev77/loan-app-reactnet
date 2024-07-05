using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CreditLoan.Dtos
{
    public class PaymentDto
    {
        public string PaymentId { get; set; }
        public int CustomerId { get; set; }
        public int InstallmentNo { get; set; }
        public decimal PaymentAmount { get; set; }
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime PaymentDate { get; set; }
    }
}
