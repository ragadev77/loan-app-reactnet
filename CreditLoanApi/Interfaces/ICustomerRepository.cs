using CreditLoan.Models;
using CreditLoanApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace CreditLoanApi.Repositories
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> List();
        Task<Customer> Get(int id);
        Task<Customer> GetByEmail(string email);
        Task<int> Create(Customer customer);
        Task<int> Update(Customer customer);
        Task<int> Delete(int id);

    }
}
