using FinTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTrack.Infrastructure.Data.Configurations;

public class VariableExpenseConfiguration : IEntityTypeConfiguration<VariableExpense>
{
    public void Configure(EntityTypeBuilder<VariableExpense> builder)
    {
        builder.Property(e => e.Description).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Amount).HasPrecision(18, 2);

        builder.HasOne(e => e.Category)
            .WithMany(c => c.VariableExpenses)
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
