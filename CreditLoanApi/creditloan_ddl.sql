CREATE TABLE Customer(
	CustomerId int IDENTITY(1,1) NOT NULL ,
	Name varchar(50) NOT NULL,
	Email varchar(20) UNIQUE NOT NULL,
	PhoneNumber varchar(20) NOT NULL,
	Address varchar(100) NOT NULL,
	Balance decimal(10,2),
	LoanAmount decimal(10,2),
	Outstanding	decimal(10,2),
	Tenor int,
	DueDate datetime,
	InterestRate decimal(10,2),
	PenaltyRate decimal(10,2),
	CONSTRAINT PK_Customer PRIMARY KEY (CustomerId)
);

CREATE TABLE UserLogin(
	id int identity(1,1),
	CustomerId int NOT NULL,
	Email varchar(20) UNIQUE NOT NULL,
	Password varchar(100),
	CONSTRAINT PK_UserLogin PRIMARY KEY (Email)
);

CREATE TABLE Payment(
	PaymentId varchar(50) NOT NULL ,
	CustomerId int NOT NULL,
	PaymentAmount decimal(10,2) NOT NULL,
	PaymentDate datetime NOT NULL,
	PaymentStatus varchar(20)
	CONSTRAINT PK_PaymentId PRIMARY KEY (PaymentId),
	CONSTRAINT FK_Payment_CustomerId Foreign KEY (CustomerId) REFERENCES Customer(CustomerId)
	ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE CreditLoanDetail (
    Id int IDENTITY(1,1),
    CustomerId int NOT NULL,
    RowNo int,
	DueDate datetime,
	TotalAmount decimal (10,2),
	MainAmount decimal (10,2),
	InterestAmount decimal (10,2),
	RemainingAmount	 decimal (10,2)	,
	PaymentStatus varchar(20),
	PaymentId varchar(50),
	PaymentDate datetime,
	CONSTRAINT PK_CreditLoanDetail PRIMARY KEY (Id)
);
