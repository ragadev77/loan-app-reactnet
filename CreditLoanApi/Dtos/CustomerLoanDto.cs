using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoanApi.Dtos
{
    public class CustomerLoanDto
    {
        public string RowId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } 
        public decimal LoanAmount { get; set; }
        public decimal Balance { get; set; }
        public decimal Outstanding { get; set; }

        public int RowNo {  get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal MainAmount { get; set; }
        public decimal InterestAmount { get; set; }
        public decimal RemainingAmount { get; set; }


        public string PaymentId { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentStatus { get; set; }

    }
}
