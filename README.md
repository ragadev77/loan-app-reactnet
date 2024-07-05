# Credit Loan Web App
Built with ASP.Net Web API - React.js 

##Settings
- DB connection string, ftp url, ftp folder, csv filename :
	\CreditLoanApi\appsettings.json 
- Tables ddl script :
	\CreditLoanApi\creditloan_ddl.sql
- Global variable api url :
	\CreditLoanReactApp\ClientApp\.env : 
- Template Csv :
	\CreditLoanApi\TemplateCsv\cust-payment.csv
	
##Backend features
- JWT Authorization
- ILogger
- Swagger 
- FTP Download File
##Frontend features
- React JS
- Export to csv, excel
- Icon : font awesome
- CSS : custom.css, dialog.css

##Noteable packages
Backend libs (CreditLoanApi.csproj )
- .Net 6.0
- Microsoft.EntityFrameworkCore 7.0.20
- Microsoft.EntityFrameworkCore.SqlServer 7.0.20
- Microsoft.AspNetCore.Authentication.JwtBearer 6.0.30
- CsvHelper : 33.0.1
- Microsoft.Data.SqlClient 5.2.0
- Newtonsoft.Json 13.0.3
- Swashbuckle.AspNetCore 6.5.0

Frontend libs 
(\ClientApp\packages.json)
- react: 18.2.0,
- react-dom: 18.2.0,
- react-router-dom: 6.24.0,
- react-bootstrap: 2.10.3,
- jspdf
- sheetjs-style
- file-saver
- jquery: 3.6.4,
- bootstrap: 5.2.3,
- bootstrap-icons: 1.11.3,
- font-awesome 4.7.0 (import at index.html)


##Folder Exclude
\CreditLoanApi\bin
\CreditLoanReactApp\ClientApp\node_modules

