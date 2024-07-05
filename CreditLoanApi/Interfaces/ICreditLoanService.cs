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
        CreditLoanDto ReportByCustomer(int customerId);
        CreditLoanDto GetLoanByCustomer(int customerId);
        List<ReportPaymentDto> ReportAll(int month, int year);
        List<PaymentDto> ReadFileFromFtp(out string message);
    }
}
