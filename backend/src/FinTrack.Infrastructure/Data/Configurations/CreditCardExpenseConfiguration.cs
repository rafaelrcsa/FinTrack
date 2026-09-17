using FinTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTrack.Infrastructure.Data.Configurations;

public class CreditCardExpenseConfiguration : IEntityTypeConfiguration<CreditCardExpense>
{
    public void Configure(EntityTypeBuilder<CreditCardExpense> builder)
    {
        builder.Property(e => e.Description).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Amount).HasPrecision(18, 2);

        builder.HasOne(e => e.Category)
            .WithMany(c => c.CreditCardExpenses)
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.CreditCard)
            .WithMany(c => c.Expenses)
            .HasForeignKey(e => e.CreditCardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
