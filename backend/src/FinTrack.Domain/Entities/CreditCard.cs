namespace FinTrack.Domain.Entities;

public class CreditCard
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public ICollection<CreditCardExpense> Expenses { get; set; } = new List<CreditCardExpense>();
}
