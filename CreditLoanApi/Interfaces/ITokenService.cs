using CreditLoan.Dtos;
using CreditLoan.Models;

namespace CreditLoanApi.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(LoginDto user);
        string TrimToken(string token);
    }
}
