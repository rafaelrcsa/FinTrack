namespace FinTrack.Api.Dtos;

public record CreditCardDto(int Id, string Name);

public record CreditCardUpsertDto(string Name);
