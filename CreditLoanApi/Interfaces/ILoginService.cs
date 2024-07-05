using CreditLoan.Dtos;
using CreditLoan.Models;
using CreditLoanApi.Dtos;
using Newtonsoft.Json.Linq;

namespace CreditLoanApi.Interfaces
{
    public interface ILoginService
    {
        //Task<int> CreateUser(User user);
        Task<User> GetUser(int id);
        LoginInfoDto Login(User login);

    }
}
