using FinTrack.Api.Dtos;
using FinTrack.Domain.Entities;
using FinTrack.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary([FromQuery] int year, [FromQuery] int month)
    {
        var fixedExpenses = await db.FixedExpenses.Include(e => e.Category).AsNoTracking().ToListAsync();
        var incomes = await db.Incomes.Include(e => e.Category).AsNoTracking().ToListAsync();
        var cardExpenses = await db.CreditCardExpenses.Include(e => e.Category).AsNoTracking()
            .Where(e => e.Date.Year == year && e.Date.Month == month)
            .ToListAsync();
        var variableExpenses = await db.VariableExpenses.Include(e => e.Category).AsNoTracking()
            .Where(e => e.Date.Year == year && e.Date.Month == month)
            .ToListAsync();

        var activeFixedExpenses = fixedExpenses.Where(e => ((IRecurring)e).IsActiveInMonth(year, month)).ToList();
        var activeIncomes = incomes.Where(e => ((IRecurring)e).IsActiveInMonth(year, month)).ToList();

        var totalIncome = activeIncomes.Sum(e => e.Amount);
        var totalFixedExpenses = activeFixedExpenses.Sum(e => e.Amount);
        var totalVariableExpenses = cardExpenses.Sum(e => e.Amount) + variableExpenses.Sum(e => e.Amount);

        var byCategory = activeFixedExpenses
            .Select(e => (e.Category!.Id, e.Category.Name, e.Category.Color, e.Amount))
            .Concat(cardExpenses.Select(e => (e.Category!.Id, e.Category.Name, e.Category.Color, e.Amount)))
            .Concat(variableExpenses.Select(e => (e.Category!.Id, e.Category.Name, e.Category.Color, e.Amount)))
            .GroupBy(x => new { x.Id, x.Name, x.Color })
            .Select(g => new CategoryBreakdownItemDto(g.Key.Id, g.Key.Name, g.Key.Color, g.Sum(x => x.Amount)))
            .OrderByDescending(x => x.Total)
            .ToList();

        var summary = new DashboardSummaryDto(
            year,
            month,
            totalIncome,
            totalFixedExpenses,
            totalVariableExpenses,
            totalIncome - totalFixedExpenses - totalVariableExpenses,
            byCategory);

        return Ok(summary);
    }
}
