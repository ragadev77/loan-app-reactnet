using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace CreditLoanApi.Models
{
    [Table("app_logger", Schema = "dbo")]
    public class DbLogger
    {
        public DbLogger() { }
        [Key]
        [Column(TypeName = "int")]
        public int id{ get; set; }

        [Column(TypeName = "varchar(10)")]
        public string LogApp { get; set; }
        
        [Column(TypeName = "varchar(20)")]
        public string LogMod { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string LogModDetail { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string LogType { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string LogName { get; set; }
        [Column(TypeName = "int")]
        public int LogCode { get; set; }
        [Column(TypeName = "varchar(200)")]
        public string LogMessage { get; set; }

        [Column(TypeName = "datetime")]
        //[DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime LogTime { get; set; }

        [Column(TypeName = "varchar(100)")]
        public string LogSource { get; set; }

    }
}
