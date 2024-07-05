using CreditLoan.Models;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CreditLoanApi.Repositories
{
    public class CreditLoanDetailRepository : ICreditLoanDetailRepository
    {
        private readonly ApiDbContext _context;

        public CreditLoanDetailRepository(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CreditLoanDetail>> List()
        {
            return await _context.creditLoanDetails.ToListAsync();
        }
        public async Task<CreditLoanDetail> Get(int id) 
        {
            return await _context.creditLoanDetails.FindAsync(id);                        
        }

        public async Task<IEnumerable<CreditLoanDetail>> GetByCustomer(int customerId)
        {
            var result = await _context.creditLoanDetails
                            .Where(u => u.CustomerId == customerId)
                            .ToListAsync();
            return result;
        }
        public async Task<CreditLoanDetail> GetByCustomerAndRowNo(int custId, int rowNo)
        {
            var result = _context.creditLoanDetails.SingleOrDefault(p => p.CustomerId == custId && p.RowNo == rowNo);
            return result;
        }
        public async Task<IEnumerable<CreditLoanDetail>> GetByCustomerAndStatus(int custId, string status)
        {
            var result = from l in _context.creditLoanDetails
                         where l.CustomerId == custId && l.PaymentStatus == status
                         select l;
            return result;
        }
        public async Task<IEnumerable<CreditLoanDetail>> GetByCustomerAndRowNoAndStatus(int custId, int rowNo, string status)
        {
            var result = from l in _context.creditLoanDetails
                         where l.CustomerId == custId && l.PaymentStatus == status && l.RowNo == rowNo
                         select l;
            return result;

        }
        /* region non-query */
        public async Task<int> Add(CreditLoanDetail loanAccountDetail)
        {
            try
            {
                _context.creditLoanDetails.Add(loanAccountDetail);
                var result = await _context.SaveChangesAsync();
                return result;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }

        public async Task Delete(int id)
        {
            var delData = await _context.creditLoanDetails.FindAsync(id);
            _ = _context.creditLoanDetails.Remove(delData);
            await _context.SaveChangesAsync();
        }

        public async Task<int> Update(CreditLoanDetail loanAccountDetail)
        {
            _context.Entry(loanAccountDetail).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }


        /* 
        public async Task<IEnumerable<CreditLoanDetail>> GetByLoanCode(string _loanCode)
        {
            //var result = await _context.creditLoanDetails
            //                .Where(l => l.loan_code == _loanCode)
            //                .FirstOrDefaultAsync();
            var result = from l in _context.creditLoanDetails
                         where l.LoanCode == _loanCode
                         select l;
            return result;
        }

        public async Task<CreditLoanDetail> GetByLoanCodeAndRowNo(string loanCode, int rowNo)
        {
            var result = _context.creditLoanDetails.SingleOrDefault(p => p.LoanCode == loanCode && p.RowNo == rowNo);
            return result;
        }

       
        public async Task<IEnumerable<CreditLoanDetail>> GetByLoanCodeAndStatus(string loanCode, string status)
        {
            var result = from l in _context.creditLoanDetails
                         where l.LoanCode == loanCode && l.PaymentStatus == status
                         select l;
            return result;
        }
        public async Task<IEnumerable<CreditLoanDetail>> GetByLoanCodeAndRowNoAndStatus(string loanCode, int rowNo, string status)
        {
            var result = from l in _context.creditLoanDetails
                         where l.LoanCode == loanCode && l.PaymentStatus == status && l.RowNo == rowNo                         
                         select l;
            return result;

        }*/


    }
}
