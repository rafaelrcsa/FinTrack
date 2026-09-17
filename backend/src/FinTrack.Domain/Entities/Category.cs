using FinTrack.Domain.Enums;

namespace FinTrack.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public CategoryType Type { get; set; }

    /// <summary>Hex color (e.g. "#6366F1") used to keep this category consistent across charts.</summary>
    public required string Color { get; set; }

    public ICollection<FixedExpense> FixedExpenses { get; set; } = new List<FixedExpense>();
    public ICollection<Income> Incomes { get; set; } = new List<Income>();
    public ICollection<CreditCardExpense> CreditCardExpenses { get; set; } = new List<CreditCardExpense>();
    public ICollection<VariableExpense> VariableExpenses { get; set; } = new List<VariableExpense>();
}
