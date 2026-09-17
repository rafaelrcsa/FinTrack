using FinTrack.Api.Dtos;
using FinTrack.Domain.Entities;
using FinTrack.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/variable-expenses")]
public class VariableExpensesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VariableExpenseDto>>> GetAll(
        [FromQuery] int? year, [FromQuery] int? month)
    {
        var query = db.VariableExpenses
            .Include(e => e.Category)
            .AsNoTracking()
            .AsQueryable();

        if (year is not null)
            query = query.Where(e => e.Date.Year == year);
        if (month is not null)
            query = query.Where(e => e.Date.Month == month);

        var expenses = await query.OrderByDescending(e => e.Date).ToListAsync();

        return Ok(expenses.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VariableExpenseDto>> GetById(int id)
    {
        var expense = await db.VariableExpenses
            .Include(e => e.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        if (expense is null) return NotFound();

        return ToDto(expense);
    }

    [HttpPost]
    public async Task<ActionResult<VariableExpenseDto>> Create(VariableExpenseUpsertDto dto)
    {
        var expense = new VariableExpense
        {
            Description = dto.Description,
            Amount = dto.Amount,
            Date = dto.Date,
            CategoryId = dto.CategoryId
        };
        db.VariableExpenses.Add(expense);
        await db.SaveChangesAsync();
        await db.Entry(expense).Reference(e => e.Category).LoadAsync();

        var result = ToDto(expense);
        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, VariableExpenseUpsertDto dto)
    {
        var expense = await db.VariableExpenses.FindAsync(id);
        if (expense is null) return NotFound();

        expense.Description = dto.Description;
        expense.Amount = dto.Amount;
        expense.Date = dto.Date;
        expense.CategoryId = dto.CategoryId;
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await db.VariableExpenses.FindAsync(id);
        if (expense is null) return NotFound();

        db.VariableExpenses.Remove(expense);
        await db.SaveChangesAsync();

        return NoContent();
    }

    private static VariableExpenseDto ToDto(VariableExpense e) => new(
        e.Id, e.Description, e.Amount, e.Date,
        e.CategoryId, e.Category!.Name, e.Category.Color);
}
