DROP FUNCTION IF EXISTS [GenerateAmmortizationSchedule]
DROP PROCEDURE IF EXISTS [GenerateReportForTestExercise]
GO

CREATE FUNCTION [GenerateAmmortizationSchedule]
(
	@interestRate DECIMAL(13, 10),
	@months INT,
	@loanAmount DECIMAL(18, 4)
)
RETURNS @ammortizationSchedule TABLE
(
	[Period] INT,
	[BeginningLoanBalance] DECIMAL(18, 2),
	[Payment] DECIMAL(18, 2),
	[Interest] DECIMAL(18, 2),
	[Principal] DECIMAL(18, 2),
	[EndingLoanBalance] DECIMAL(18, 2)
)
AS
BEGIN
	DECLARE @monthlyInterestPayment DECIMAL(18, 10) = @interestRate / 12;
	DECLARE @compoundInterest DECIMAL(18, 10) = POWER(1 + @monthlyInterestPayment, @months);
	
	DECLARE @totalMonthlyPayment DECIMAL(18, 10) = @loanAmount * ((@monthlyInterestPayment * @compoundInterest)/(@compoundInterest - 1));
	DECLARE @outstandingLoanBalance DECIMAL(18, 10) = @loanAmount;

	DECLARE @currentMonth INT = 1;

	WHILE (@currentMonth <= @months)
	BEGIN
		DECLARE @principlePayment DECIMAL(18, 10) = @totalMonthlyPayment - @outstandingLoanBalance * @monthlyInterestPayment;
		DECLARE @interestPayment DECIMAL(18, 10) = @totalMonthlyPayment - @principlePayment;
		DECLARE @beginningLoanBalance DECIMAL(18, 10) = @outstandingLoanBalance;
		SET @outstandingLoanBalance -= @principlePayment;

		INSERT INTO @ammortizationSchedule VALUES
		(
			@currentMonth,
			@beginningLoanBalance,
			@totalMonthlyPayment,
			@interestPayment,
			@principlePayment,
			@outstandingLoanBalance
		);

		SET @currentMonth += 1;
	END

	RETURN;
END
GO

CREATE PROCEDURE [GenerateReportForTestExercise]
AS
BEGIN
	DECLARE @initialReport TABLE
	(
		[Period] INT,
		[BeginningLoanBalance] DECIMAL(18, 2),
		[Payment] DECIMAL(18, 2),
		[Interest] DECIMAL(18, 2),
		[Principal] DECIMAL(18, 2),
		[EndingLoanBalance] DECIMAL(18, 2)
	);

	-- Please write a stored procedure that creates an amortization schedule (the Spitzer Table)
	-- for a loan of 36000 and interest of 8% for 36 monthly payments. 
	INSERT INTO @initialReport
	SELECT * FROM [GenerateAmmortizationSchedule](0.08, 36, 36000);

	-- After the 12th payment, you are required to change the loan’s setup
	DECLARE @loanBalanceAfterAYear DECIMAL(18, 2);
	SELECT @loanBalanceAfterAYear = [EndingLoanBalance]
	FROM @initialReport
	WHERE [Period] = 12;

	-- perform a loan recycle on the remaining amount (according to the amortization schedule table)
	-- with a fixed interest of 4.5% for an additional 48 payments.
	SELECT * FROM @initialReport WHERE [Period] <= 12
	UNION ALL
	SELECT [Period] + 12 AS [Period], [BeginningLoanBalance], [Payment], [Interest], [Principal], [EndingLoanBalance]
	FROM [GenerateAmmortizationSchedule](0.045, 48, @loanBalanceAfterAYear);
END
GO

EXEC [GenerateReportForTestExercise]
GO
