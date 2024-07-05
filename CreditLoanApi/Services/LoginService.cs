using CreditLoan.Dtos;
using CreditLoan.Models;
using CreditLoan.Services;
using CreditLoanApi.Dtos;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using CreditLoanApi.Repositories;
using Newtonsoft.Json.Linq;
using System;
using System.Data;
using System.Reflection.Metadata;
using System.Runtime.CompilerServices;

namespace CreditLoanApi.Services
{
    public class LoginService : ILoginService
    {
        private readonly IUserRepository _repository;
        private readonly ICustomerService _customerService;
        private readonly ITokenService _tokenService;

        private readonly ILogger<LoginService> _logger;
        public LoginService(IUserRepository userRepository, ICustomerService customerService
            , ITokenService tokenService, ILogger<LoginService> logger) 
        {
            _repository = userRepository;
            _customerService = customerService;
            _tokenService = tokenService;
            _logger = logger;
        }

        public LoginInfoDto Login(User login)
        {
            var retVal = new LoginInfoDto();
            try
            {
                User user =  _repository.GetByEmail(login.Email).Result;
                if (user == null)
                    retVal.Message = "account not exist, please register!";
                else
                {
                    if (login.Password != user.Password)
                        retVal.Message = "wrong password";
                    else
                    { 
                        Customer cust = _customerService.GetCustomer(user.CustomerId).Result;
                        if (cust == null)
                            retVal.Message = "customer data with that email is missing from database!";
                        else
                        {
                            LoginDto userLogin = new LoginDto();
                            userLogin.UserId = cust.CustomerId;
                            userLogin.Name = cust.Name;
                            userLogin.Email = login.Email;
                            userLogin.Token = _tokenService.GenerateToken(userLogin);
                            retVal.Message = "success";
                            retVal.Login = userLogin;
                            return retVal;
                        }

                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Service Login Error: {ex.Message}");
                _logger.LogError($"Service Login Error: {ex.Message}");
                retVal.Message = "Service Login Error";
            }

            return retVal;

        }        

        public Task<User> GetUser(int _id)
        {
            var data = _repository.Get(_id);
            return data;
        }

        public Task<int> CreateUser(User _user)
        {
            var data = _repository.Create(_user);
            return data;
        }
        public Task<int> UpdateUser(int _id, User _user)
        {            
            var result = _repository.Update(_user);
            return result;
        }
        
    }
}
