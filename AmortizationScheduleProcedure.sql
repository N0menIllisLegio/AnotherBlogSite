DROP PROCEDURE IF EXISTS [GenerateReportForTestExercise]
DROP FUNCTION IF EXISTS [GenerateAmortizationSchedule]
GO

CREATE FUNCTION [dbo].[GenerateAmortizationSchedule]
(
    @interestRate DECIMAL(13, 10),
    @months INT,
    @loanAmount DECIMAL(18, 4)
)
RETURNS TABLE
AS
RETURN
WITH [Report]([Period], [MonthlyInterestPayment], [BeginningLoanBalance], [Payment], [Principal], [Interest], [EndingLoanBalance]) AS (
	SELECT
		1
			AS [Period],
		[PreCalculations].[MonthlyInterestPayment]
			AS [MonthlyInterestPayment],
		CAST(@loanAmount
			AS DECIMAL(19, 4))
			AS [BeginningLoanBalance],
		CAST([PreCalculations].[Payment]
			AS DECIMAL(19, 4))
			AS [Payment],
		CAST([PreCalculations].[payment] - @loanAmount * [PreCalculations].[monthlyInterestPayment]
			AS DECIMAL(19, 4))
			AS [Principal],
		CAST(@loanAmount * [PreCalculations].[monthlyInterestPayment]
			AS DECIMAL(19, 4))
			AS [Interest],
		CAST(@loanAmount - ([PreCalculations].[payment] - @loanAmount * [PreCalculations].[monthlyInterestPayment])
			AS DECIMAL(19, 4))
			AS [EndingLoanBalance]
		FROM (
			SELECT
				@loanAmount * ((@interestRate / 12) * CAST(POWER(1 + @interestRate / 12, @months) AS DECIMAL(19, 10))) / (CAST(POWER(1 + @interestRate / 12, @months) AS DECIMAL(19, 10)) - 1.0)
					AS [Payment],
				@interestRate / 12.0
					AS [MonthlyInterestPayment]
         ) AS PreCalculations

	UNION ALL

	SELECT [Period] + 1,
		[MonthlyInterestPayment],
		[EndingLoanBalance],
		[Payment],
		CAST([Payment] - [EndingLoanBalance] * [MonthlyInterestPayment] AS DECIMAL(19, 4)),
		CAST([Payment] - ([Payment] - [EndingLoanBalance] * [MonthlyInterestPayment]) AS DECIMAL(19, 4)),
		CAST([EndingLoanBalance] - ([Payment] - [EndingLoanBalance] * [MonthlyInterestPayment]) AS DECIMAL(19, 4))
	FROM [Report]
	WHERE [Period] < @months
)
SELECT
    [Period],
    [BeginningLoanBalance],
    [Payment],
    [Principal],
    [Interest],
    [EndingLoanBalance]
FROM [Report]
    GO

CREATE PROCEDURE [GenerateReportForTestExercise]
AS
BEGIN
	DECLARE @initialReport TABLE
	(
		[Period] INT,
		[BeginningLoanBalance] DECIMAL(19, 4),
		[Payment] DECIMAL(19, 4),
		[Interest] DECIMAL(19, 4),
		[Principal] DECIMAL(19, 4),
		[EndingLoanBalance] DECIMAL(19, 4)
	);


INSERT INTO
    @initialReport
SELECT
    [Period],
    [BeginningLoanBalance],
    [Payment],
    [Interest],
    [Principal],
    [EndingLoanBalance]
FROM
    [GenerateAmortizationSchedule](0.08, 36, 36000);


DECLARE
@loanBalanceAfterAYear DECIMAL(19, 2);


SELECT
    @loanBalanceAfterAYear = [EndingLoanBalance]
FROM
    @initialReport
WHERE
    [Period] = 12;


SELECT
    [Period],
    [BeginningLoanBalance],
    [Payment],
    [Interest],
    [Principal],
    [EndingLoanBalance]
FROM
    @initialReport
WHERE
    [Period] <= 12
UNION ALL
SELECT
    [Period] + 12 AS [Period],
    [BeginningLoanBalance],
    [Payment],
    [Interest],
    [Principal],
    [EndingLoanBalance]
FROM
    [GenerateAmortizationSchedule](0.045, 48, @loanBalanceAfterAYear);
END
GO

EXEC [GenerateReportForTestExercise];