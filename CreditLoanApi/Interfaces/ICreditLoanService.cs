using CreditLoan.Dtos;
using CreditLoan.Models;
using CreditLoanApi.Dtos;
using CreditLoanApi.Models;
using CreditLoanApi.Repositories;
using System.Data;

namespace CreditLoanApi.Interfaces
{
    public interface ICreditLoanService
    {
        CreditLoanDto CreateLoan(LoanRequestDto loanRequest);
        CreditLoanDto GetLoanByCustomer(int customerId);
        List<CreditLoanDto> GetListLoan();
        List<CustomerLoanDto> GetCustomerLoansByPeriod(int month, int year, int page, int pageSize);
        List<PaymentDto> ReadFileFromFtp(out string message);
    }
}
