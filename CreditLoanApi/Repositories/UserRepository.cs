using CreditLoan.Models;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CreditLoanApi.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApiDbContext _context;

        public UserRepository(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> List()
        {
            return await _context.users.ToListAsync();
        }
        public async Task<User> Get(int id) 
        {
            return await _context.users.FindAsync(id);                        
        }
        public async Task<User> GetByCustomer(int customerId)
        {
            var result = await _context.users
                            .Where(u => u.CustomerId == customerId)
                            .FirstOrDefaultAsync();
            return result;
        }
        public async Task<User> GetByEmail(string _email)
        {
            var result = await _context.users
                            .Where(u => u.Email == _email)
                            .FirstOrDefaultAsync();
            return result;
        }
        public async Task<User> GetByEmailByPassword(string _email, string _password)
        {
            var result = _context.users
                            .Where(u => u.Email == _email && u.Password == _password)
                            .FirstOrDefault();
            return result;
        }

        /* region non-query */
        public async Task<int> Create(User _user)
        {
            _context.users.Add(_user);
            var result =  await _context.SaveChangesAsync();                
            return result;
        }

        public async Task Delete(int id)
        {
            var delData = await _context.users.FindAsync(id);
            _ = _context.users.Remove(delData);
            await _context.SaveChangesAsync();
        }

        public async Task<int> Update(User _user)
        {
            _context.Entry(_user).State = EntityState.Modified;
            var result = await _context.SaveChangesAsync();
            return result;
        }
    }
}
