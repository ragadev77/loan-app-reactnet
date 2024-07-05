using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CreditLoan.Dtos
{
    public class PaymentCodeDto
    {
        public string loanCode { get; set; }
        public int rowNo { get; set; }
        public int customerId { get; set; }
    }
}
