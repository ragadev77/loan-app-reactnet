using CreditLoan.Dtos;
using CreditLoan.Models;
using CreditLoanApi.Dtos;
using CreditLoanApi.Models;
using CreditLoanApi.Repositories;
using System.Data;

namespace CreditLoanApi.Interfaces
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> List();
        Task<Payment> Get(string paymentId);
        Task<int> Create(Payment payment);
        Task<int> Update(Payment payment);


    }
}
