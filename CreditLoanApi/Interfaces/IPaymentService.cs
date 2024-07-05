using CreditLoan.Dtos;
using CreditLoan.Models;
using CreditLoanApi.Dtos;
using Newtonsoft.Json.Linq;

namespace CreditLoanApi.Interfaces
{
    public interface IPaymentService
    {
        Task<List<PaymentDtoOut>> SyncPaymentFromFtp();

    }
}
