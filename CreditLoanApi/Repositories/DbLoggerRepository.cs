using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;

namespace CreditLoanApi.Repositories
{
    public class DbLoggerRepository : IDbLoggerRepository
    {
        private readonly ApiDbContext _context;
        public DbLoggerRepository(ApiDbContext apiDbContext)
        {
            _context = apiDbContext;
        }

        public async Task<IEnumerable<DbLogger>> ListDbLogger()
        {
            return await _context.dbLoggers.ToListAsync();
        }

        public int AddDbLogger(DbLogger dbLogger)
        {
            dbLogger.LogTime = DateTime.Now;

            _context.dbLoggers.Add(dbLogger);
            return _context.SaveChanges();

        }
    }
}
