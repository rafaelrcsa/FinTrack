namespace FinTrack.Domain.Entities;

/// <summary>A single variable transaction paid outside a credit card (cash, debit, transfer...). Not recurring.</summary>
public class VariableExpense
{
    public int Id { get; set; }
    public required string Description { get; set; }
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}
