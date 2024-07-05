using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace CreditLoanApi.Models
{
    [Table("db_logger", Schema = "dbo")]
    public class DbLogger
    {
        public DbLogger() { }
        [Key]
        [Column("id", TypeName = "int")]
        public int id{ get; set; }

        [Column("log_name", TypeName = "varchar(50)")]
        public string log_name { get; set; }
        
        [Column("log_category", TypeName = "varchar(20)")]
        public string log_category { get; set; }

        [Column("log_message", TypeName = "text")]
        public string log_message { get; set; }

        [Column("log_error", TypeName = "varchar(100)")]
        public string log_error { get; set; }

        [Column("log_code")]
        public int log_code { get; set; }

        [Column("log_time")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime log_time { get; set; }

    }
}
