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
            DbLogger logger = new DbLogger();
            logger.log_name = dbLogger.log_name;
            logger.log_category = dbLogger.log_category;
            logger.log_message = dbLogger.log_message;
            logger.log_error = dbLogger.log_error;
            logger.log_code = dbLogger.log_code;
            logger.log_time = DateTime.Now;//DateTime.ParseExact(dbLogger.log_time + " 00:00:00", "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

            _context.dbLoggers.Add(logger);
            return _context.SaveChanges();

        }
    }
}
