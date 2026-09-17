namespace FinTrack.Api.Dtos;

public record CreditCardExpenseDto(
    int Id,
    string Description,
    decimal Amount,
    DateOnly Date,
    int CategoryId,
    string CategoryName,
    string CategoryColor,
    int CreditCardId,
    string CreditCardName);

public record CreditCardExpenseUpsertDto(
    string Description,
    decimal Amount,
    DateOnly Date,
    int CategoryId,
    int CreditCardId);
