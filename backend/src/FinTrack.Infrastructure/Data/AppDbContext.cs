using FinTrack.Domain.Entities;
using FinTrack.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CreditCard> CreditCards => Set<CreditCard>();
    public DbSet<FixedExpense> FixedExpenses => Set<FixedExpense>();
    public DbSet<Income> Incomes => Set<Income>();
    public DbSet<CreditCardExpense> CreditCardExpenses => Set<CreditCardExpense>();
    public DbSet<VariableExpense> VariableExpenses => Set<VariableExpense>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        SeedCategories(modelBuilder);
    }

    private static void SeedCategories(ModelBuilder modelBuilder)
    {
        // Colors are the validated 8-slot categorical order from the dataviz skill's
        // reference palette (blue, orange, aqua, yellow, magenta, green, violet, red) -
        // picked for CVD-safe adjacency, not for "intuitive" category-color matching.
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Moradia", Type = CategoryType.Expense, Color = "#2a78d6" },
            new Category { Id = 2, Name = "Contas e Utilidades", Type = CategoryType.Expense, Color = "#eb6834" },
            new Category { Id = 3, Name = "Transporte", Type = CategoryType.Expense, Color = "#1baf7a" },
            new Category { Id = 4, Name = "Alimentação", Type = CategoryType.Expense, Color = "#eda100" },
            new Category { Id = 5, Name = "Assinaturas", Type = CategoryType.Expense, Color = "#e87ba4" },
            new Category { Id = 6, Name = "Saúde", Type = CategoryType.Expense, Color = "#008300" },
            new Category { Id = 7, Name = "Lazer", Type = CategoryType.Expense, Color = "#4a3aa7" },
            new Category { Id = 8, Name = "Outros", Type = CategoryType.Expense, Color = "#e34948" },
            new Category { Id = 9, Name = "Salário", Type = CategoryType.Income, Color = "#008300" },
            new Category { Id = 10, Name = "Renda Extra", Type = CategoryType.Income, Color = "#1baf7a" }
        );
    }
}
