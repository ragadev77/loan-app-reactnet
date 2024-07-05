using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoan.Models
{
    public class LoanRequestDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public decimal LoanAmount { get; set; }
        public int Tenor { get; set; }
        public decimal InterestRate { get; set; }
        public DateTime LoanDate { get; set; }
    }
}

