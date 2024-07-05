using System.ComponentModel.DataAnnotations;

namespace CreditLoanApi.Dtos
{
    public class UpdateCustomerDto
    {
        public int CustomerId { get; set; } 
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
    }
}
