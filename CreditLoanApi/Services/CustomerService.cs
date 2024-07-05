using Azure.Identity;
using CreditLoan.Models;
using CreditLoanApi.Dtos;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using CreditLoanApi.Repositories;
using System;
using System.Data;
using System.Globalization;
using System.Reflection.Metadata;

namespace CreditLoanApi.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _custRepository;
        private readonly IUserRepository _userRepository;

        private readonly ILogger<CustomerService> _logger;
        DateTime localDateTime, univDateTime;

        public CustomerService(ICustomerRepository custRepository, IUserRepository userRepository, ILogger<CustomerService> logger) 
        {
            _custRepository = custRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        public Task<IEnumerable<Customer>> ListCustomer(int page, int pageSize)
        {
            var data = _custRepository.List();
            return data;
        }

        public async Task<Customer> GetCustomer(int _id)
        {
            var data = await _custRepository.Get(_id);
            return data;
        }

        public async Task<string> CreateCustomer(CreateCustomerDto customer)
        {
            try
            {
                //int result = 0;
                string result = "failed";
                string emptyDate = "1900-01-01";

                /* email validation  */
                var search =  _custRepository.GetByEmail(customer.Email).Result;
                if (search != null)
                {
                    return "Email already exist";
                }
                else
                {
                    /* save customer  */

                    Customer entry = new Customer();
                    entry.Name = customer.Name;
                    entry.Email = customer.Email;
                    entry.Address = customer.Address;
                    entry.PhoneNumber = customer.PhoneNumber;
                    entry.DueDate = DateTime.ParseExact(emptyDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                    var isCustCreated = _custRepository.Create(entry).Result;
                    if (isCustCreated == 1)
                    {
                        var newCust = _custRepository.GetByEmail(customer.Email).Result;
                        /* save user login */
                        User user = new User();
                        user.CustomerId = newCust.CustomerId;
                        user.Email = customer.Email;
                        user.Password = customer.Password;
                        var isLoginCreated = await _userRepository.Create(user);
                        if (isLoginCreated == 1)
                        {
                            result = "success";
                        }
                    }
                    return result;
                }


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return ex.Message;
            }
        }
        public async Task<int> UpdateCustomer(Customer customer)
        {

            try
            {
                var result = 0;
                var cust = _custRepository.Get(customer.CustomerId).Result;
                if (cust == null) return 0;

                cust.Name = customer.Name;
                cust.PhoneNumber = customer.PhoneNumber;
                cust.Email = customer.Email;    
                cust.Address = customer.Address;
                // update customer
                result = _custRepository.Update(cust).Result;
                // update login email
                var login = _userRepository.GetByCustomer(customer.CustomerId).Result;
                if (login != null)
                {
                    login.Email = customer.Email;
                    result = _userRepository.Update(login).Result;
                }
                return result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return 0;
            }
        }

        public Task<int> DeleteCustomer(int _id)
        {
            var result = _custRepository.Delete(_id);
            return result;
        }

    }
}
