namespace FinTrack.Api.Dtos;

public record CategoryBreakdownItemDto(int CategoryId, string CategoryName, string CategoryColor, decimal Total);

public record DashboardSummaryDto(
    int Year,
    int Month,
    decimal TotalIncome,
    decimal TotalFixedExpenses,
    decimal TotalVariableExpenses,
    decimal Balance,
    IReadOnlyList<CategoryBreakdownItemDto> ExpenseByCategory);
