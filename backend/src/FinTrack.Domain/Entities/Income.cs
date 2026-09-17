namespace FinTrack.Domain.Entities;

/// <summary>
/// A recurring monthly income (salary) or a one-off payment (StartDate == EndDate's month).
/// Recurs on the day-of-month of <see cref="StartDate"/> until <see cref="EndDate"/> (inclusive),
/// or indefinitely if null.
/// </summary>
public class Income : IRecurring
{
    public int Id { get; set; }
    public required string Source { get; set; }
    public decimal Amount { get; set; }
    public string? Notes { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}
