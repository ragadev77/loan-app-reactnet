using CreditLoan.Dtos;
using CreditLoan.Models;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CreditLoanApi.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApiDbContext _context;

        public PaymentRepository(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> List()
        {
            return await _context.payments.ToListAsync();
        }
        public async Task<Payment> Get(string paymentId)
        {
            var result = _context.payments.SingleOrDefault(c => c.PaymentId == paymentId);
            return result;
        }

        /* region non-query */
        public async Task<int> Create(Payment payment)
        {
            try
            {
                _context.payments.Add(payment);
                var result = await _context.SaveChangesAsync();
                return result;

            }
            catch (Exception ex) { 
                Console.WriteLine(ex.InnerException.Message);
                return 0;
            }
        }

        public async Task<int> Update(Payment payment)
        {
            _context.Entry(payment).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
            
        }

        public async Task<int> Delete(int id)
        {
            var delData = await _context.payments.FindAsync(id);
            _ = _context.payments.Remove(delData);
            return await _context.SaveChangesAsync();
        }
    }
}
