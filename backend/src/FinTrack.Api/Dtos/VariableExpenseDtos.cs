namespace FinTrack.Api.Dtos;

public record VariableExpenseDto(
    int Id,
    string Description,
    decimal Amount,
    DateOnly Date,
    int CategoryId,
    string CategoryName,
    string CategoryColor);

public record VariableExpenseUpsertDto(
    string Description,
    decimal Amount,
    DateOnly Date,
    int CategoryId);
