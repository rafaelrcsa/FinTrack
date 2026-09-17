using FinTrack.Domain.Enums;

namespace FinTrack.Api.Dtos;

public record CategoryDto(int Id, string Name, CategoryType Type, string Color);

public record CategoryUpsertDto(string Name, CategoryType Type, string Color);
