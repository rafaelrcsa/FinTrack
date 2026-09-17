namespace FinTrack.Domain.Entities;

/// <summary>A single variable/credit-card transaction. Not recurring — one row per purchase.</summary>
public class CreditCardExpense
{
    public int Id { get; set; }
    public required string Description { get; set; }
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public int CreditCardId { get; set; }
    public CreditCard? CreditCard { get; set; }
}
