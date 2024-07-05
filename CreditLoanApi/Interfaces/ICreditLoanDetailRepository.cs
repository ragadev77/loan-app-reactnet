using CreditLoan.Models;
using CreditLoanApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace CreditLoanApi.Interfaces
{
    public interface ICreditLoanDetailRepository
    {
        Task<IEnumerable<CreditLoanDetail>> List();
        Task<CreditLoanDetail> Get(int id);
        Task<IEnumerable<CreditLoanDetail>> GetByCustomer(int custId);
        Task<CreditLoanDetail> GetByCustomerAndRowNo(int custId, int rowNo);
        Task<IEnumerable<CreditLoanDetail>> GetByCustomerAndStatus(int custId, string status);
        Task<IEnumerable<CreditLoanDetail>> GetByCustomerAndRowNoAndStatus(int custId, int rowNo, string status);
        Task<int> Add(CreditLoanDetail accountDetail);
        Task Delete(int id);
        Task<int> Update(CreditLoanDetail accountDetail);
    }
}
