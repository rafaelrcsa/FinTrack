namespace FinTrack.Domain.Entities;

/// <summary>
/// A recurring monthly expense (rent, utilities, subscriptions). Recurs on the day-of-month
/// of <see cref="StartDate"/> until <see cref="EndDate"/> (inclusive), or indefinitely if null.
/// </summary>
public class FixedExpense : IRecurring
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public decimal Amount { get; set; }
    public string? Notes { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}
