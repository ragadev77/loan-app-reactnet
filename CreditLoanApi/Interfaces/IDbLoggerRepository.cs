using CreditLoanApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace CreditLoanApi.Interfaces
{
    public interface IDbLoggerRepository
    {
        Task<IEnumerable<DbLogger>> ListDbLogger();
        int AddDbLogger(DbLogger dbLogger);
    }
}
