using CreditLoan.Models;

namespace CreditLoanApi.Dtos
{
    public class CreditLoanDto
    {
        public Customer Customer{ get; set; }
        public IEnumerable<CreditLoanDetail> Details { get; set; }
    }
}
