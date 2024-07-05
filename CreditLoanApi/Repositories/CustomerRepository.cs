using CreditLoan.Models;
using CreditLoanApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CreditLoanApi.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApiDbContext _context;

        public CustomerRepository(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Customer>> List()
        {
            return await _context.customers.ToListAsync();
        }
        public async Task<Customer> Get(int id)
        {
            return await _context.customers.FindAsync(id);
        }
        public async Task<Customer> GetByEmail(string email)
        {
            try
            {
                var result = await _context.customers
                                .Where(c => c.Email == email)
                                .FirstOrDefaultAsync();
                return result;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }
/*
        public async Task<Customer> GetByLoanCode(string loanCode)
        {
            var result = await _context.customers
                            .Where(c => c.LoanCode == loanCode)
                            .FirstOrDefaultAsync();
            return result;
        }
*/
        /* region non-query */
        public async Task<int> Create(Customer cust)
        {
            try
            {
                _context.customers.Add(cust);
                var result = await _context.SaveChangesAsync();
                return result;

            }
            catch (Exception ex) { 
                Console.WriteLine(ex.ToString());
                return 0;
            }
        }

        public async Task<int> Update(Customer cust)
        {
            _context.Entry(cust).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
            
        }

        public async Task<int> Delete(int id)
        {
            var delData = await _context.customers.FindAsync(id);
            _ = _context.customers.Remove(delData);
            return await _context.SaveChangesAsync();
        }
    }
}
