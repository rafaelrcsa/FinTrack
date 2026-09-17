namespace FinTrack.Api.Dtos;

public record FixedExpenseDto(
    int Id,
    string Name,
    decimal Amount,
    string? Notes,
    int CategoryId,
    string CategoryName,
    string CategoryColor,
    DateOnly StartDate,
    DateOnly? EndDate);

public record FixedExpenseUpsertDto(
    string Name,
    decimal Amount,
    string? Notes,
    int CategoryId,
    DateOnly StartDate,
    DateOnly? EndDate);
