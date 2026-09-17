using FinTrack.Api.Dtos;
using FinTrack.Domain.Entities;
using FinTrack.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/fixed-expenses")]
public class FixedExpensesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FixedExpenseDto>>> GetAll([FromQuery] int? year, [FromQuery] int? month)
    {
        var query = db.FixedExpenses.Include(e => e.Category).AsNoTracking();

        IEnumerable<FixedExpense> expenses = await query.OrderBy(e => e.StartDate).ToListAsync();

        if (year is not null && month is not null)
        {
            expenses = expenses.Where(e => ((IRecurring)e).IsActiveInMonth(year.Value, month.Value));
        }

        return Ok(expenses.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FixedExpenseDto>> GetById(int id)
    {
        var expense = await db.FixedExpenses.Include(e => e.Category).AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        if (expense is null) return NotFound();

        return ToDto(expense);
    }

    [HttpPost]
    public async Task<ActionResult<FixedExpenseDto>> Create(FixedExpenseUpsertDto dto)
    {
        var expense = new FixedExpense
        {
            Name = dto.Name,
            Amount = dto.Amount,
            Notes = dto.Notes,
            CategoryId = dto.CategoryId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };
        db.FixedExpenses.Add(expense);
        await db.SaveChangesAsync();
        await db.Entry(expense).Reference(e => e.Category).LoadAsync();

        var result = ToDto(expense);
        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, FixedExpenseUpsertDto dto)
    {
        var expense = await db.FixedExpenses.FindAsync(id);
        if (expense is null) return NotFound();

        expense.Name = dto.Name;
        expense.Amount = dto.Amount;
        expense.Notes = dto.Notes;
        expense.CategoryId = dto.CategoryId;
        expense.StartDate = dto.StartDate;
        expense.EndDate = dto.EndDate;
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await db.FixedExpenses.FindAsync(id);
        if (expense is null) return NotFound();

        db.FixedExpenses.Remove(expense);
        await db.SaveChangesAsync();

        return NoContent();
    }

    private static FixedExpenseDto ToDto(FixedExpense e) => new(
        e.Id, e.Name, e.Amount, e.Notes,
        e.CategoryId, e.Category!.Name, e.Category.Color,
        e.StartDate, e.EndDate);
}
