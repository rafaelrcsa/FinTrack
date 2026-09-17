namespace FinTrack.Api.Dtos;

public record IncomeDto(
    int Id,
    string Source,
    decimal Amount,
    string? Notes,
    int CategoryId,
    string CategoryName,
    string CategoryColor,
    DateOnly StartDate,
    DateOnly? EndDate);

public record IncomeUpsertDto(
    string Source,
    decimal Amount,
    string? Notes,
    int CategoryId,
    DateOnly StartDate,
    DateOnly? EndDate);
