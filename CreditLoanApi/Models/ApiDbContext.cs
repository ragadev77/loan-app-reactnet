using CreditLoan.Models;
using Microsoft.EntityFrameworkCore;

namespace CreditLoanApi.Models
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions options) : base(options)
        {
            //Database.EnsureCreated();
        }

        public DbSet<DbLogger> dbLoggers { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<Customer> customers { get; set; }
        public DbSet<Payment> payments { get; set; }
        public DbSet<CreditLoanHeader> loanAccountHeaders { get; set; }
        public DbSet<CreditLoanDetail> creditLoanDetails { get; set; }

    }
}
