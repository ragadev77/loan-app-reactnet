using CreditLoan.Models;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CreditLoanApi.Repositories
{
    public class CreditLoanHeaderRepository
    {
        private readonly ApiDbContext _context;

        public CreditLoanHeaderRepository(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CreditLoanHeader>> List()
        {
            return await _context.loanAccountHeaders.ToListAsync();
        }
        public async Task<CreditLoanHeader> Get(int id) 
        {
            return await _context.loanAccountHeaders.FindAsync(id);                        
        }
        public async Task<CreditLoanHeader> GetByCustomer(int customerId)
        {
            try
            {
                var result = _context.loanAccountHeaders.SingleOrDefault(p => p.CustomerId == customerId);
                //var result = (from c in _context.loanAccountHeaders
                //              where c.CustomerId == customerId
                //              select c).First();
                if (result != null)
                {
                    return result;
                }
                else return null;
                

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }


        }
        public async Task<CreditLoanHeader> GetByLoanCode(string _loanCode)
        {
            var result = await _context.loanAccountHeaders
                            .Where(h => h.LoanCode == _loanCode)
                            .FirstOrDefaultAsync();
            return result;

        }
        public int GetLastId()
        {
            if (_context.loanAccountHeaders.Count() == 0) return 0;
            int lastId =  _context.loanAccountHeaders.MaxAsync(u => u.Id).Result;            
                            
            return lastId;

        }


        /* region non-query */
        public async Task<int> Add(CreditLoanHeader accountHeader)
        {
/*                if (accountHeader.id == 0)
                {
                    _context.loanAccountHeaders.Add(accountHeader);
                }
                else
                {
                    LoanAccountHeader entry = new LoanAccountHeader();
                    entry.loan_code = accountHeader.loan_code;
                    entry.plafond = accountHeader.plafond;
                    entry.cycle_month = accountHeader.cycle_month;
                    entry.interest_rate = accountHeader.interest_rate;
                    entry.installment_date = DateTime.ParseExact(accountHeader.installment_date + " 00:00:00", "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                    //entry.Location = _context.Locations.FirstOrDefault(p => p.locationId == accountHeader.LocationId);

                    _context.loanAccountHeaders.Add(entry);
                }
*/
                _context.loanAccountHeaders.Add(accountHeader);
                var result =  await _context.SaveChangesAsync();                
                return result;
        }

        public async Task Delete(int id)
        {
            var delData = await _context.loanAccountHeaders.FindAsync(id);
            _ = _context.loanAccountHeaders.Remove(delData);
            await _context.SaveChangesAsync();
        }

        public async Task Update(CreditLoanHeader LoanAccountHeader)
        {
            _context.Entry(LoanAccountHeader).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
