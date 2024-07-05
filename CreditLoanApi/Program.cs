using CreditLoan.Services;
using CreditLoanApi.Interfaces;
using CreditLoanApi.Models;
using CreditLoanApi.Repositories;
using CreditLoanApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
{

    builder.Services.AddDbContext<ApiDbContext>(o =>
        o.UseSqlServer(builder.Configuration.GetConnectionString("MsSqlServer")));
    builder.Services.AddScoped<IDbLoggerRepository, DbLoggerRepository>();
    builder.Services.AddScoped<ICreditLoanService, CreditLoanService>();
    builder.Services.AddScoped<ICreditLoanDetailRepository, CreditLoanDetailRepository>();
    builder.Services.AddScoped<IPaymentService, PaymentService>();
    builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
    builder.Services.AddScoped<ILoginService, LoginService>();
    builder.Services.AddScoped<IUserRepository, UserRepository >();
    builder.Services.AddScoped<ICustomerService, CustomerService>();
    builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
    builder.Services.AddScoped<ITokenService, TokenService>();
    builder.Services.AddHttpClient();
    builder.Services.AddControllers();

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();


    builder.Services.AddSwaggerGen(option =>
    {
        option.SwaggerDoc("v1", new OpenApiInfo { Title = "Credit Loan API", Version = "v1" });
        option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "Bearer"
        });
        option.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type=ReferenceType.SecurityScheme,
                        Id="Bearer"
                    }
                },
                new string[]{}
            }
        });
    });

}

var app = builder.Build();
{
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors(x => x
     .AllowAnyMethod()
     .AllowAnyHeader()
     .AllowCredentials()
      //.WithOrigins("https://localhost:7111))
      .SetIsOriginAllowed(origin => true));

    app.UseAuthorization();
    app.MapControllers();
    app.Run();

}


