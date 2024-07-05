using CreditLoan.Models;
using CreditLoanApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace CreditLoanApi.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> List();
        Task<User> Get(int id);
        Task<User> GetByCustomer(int customerId);
        Task<User> GetByEmail(string email);
        Task<User> GetByEmailByPassword(string email, string password);
        Task<int> Create(User user);
        Task<int> Update(User user);

    }
}
