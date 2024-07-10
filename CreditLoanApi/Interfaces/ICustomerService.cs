using CreditLoan.Models;
using CreditLoanApi.Dtos;
using CreditLoanApi.Models;
using CreditLoanApi.Repositories;
using System.Data;

namespace CreditLoanApi.Interfaces
{
    public interface ICustomerService
    {
        Task<List<Customer>> ListCustomer(SearchParameterDto prm);
        Task<Customer> GetCustomer(int id);
        Task<string> CreateCustomer(CreateCustomerDto user);
        Task<int> UpdateCustomer(Customer user);
        Task<int> DeleteCustomer(int id);


    }
}
