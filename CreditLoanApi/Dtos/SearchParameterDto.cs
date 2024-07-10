using CreditLoan.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CreditLoanApi.Dtos
{
    public class SearchParameterDto
    {
        public int page { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? NameEmail { get; set; }
        public string? Status { get; set; }
        public decimal? LoanAmount { get; set; } = 0;
        public decimal? Balance { get; set; } = 0;

    }
}
