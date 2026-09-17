using FinTrack.Api.Dtos;
using FinTrack.Domain.Entities;
using FinTrack.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/credit-card-expenses")]
public class CreditCardExpensesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CreditCardExpenseDto>>> GetAll(
        [FromQuery] int? year, [FromQuery] int? month, [FromQuery] int? cardId)
    {
        var query = db.CreditCardExpenses
            .Include(e => e.Category)
            .Include(e => e.CreditCard)
            .AsNoTracking()
            .AsQueryable();

        if (year is not null)
            query = query.Where(e => e.Date.Year == year);
        if (month is not null)
            query = query.Where(e => e.Date.Month == month);
        if (cardId is not null)
            query = query.Where(e => e.CreditCardId == cardId);

        var expenses = await query.OrderByDescending(e => e.Date).ToListAsync();

        return Ok(expenses.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CreditCardExpenseDto>> GetById(int id)
    {
        var expense = await db.CreditCardExpenses
            .Include(e => e.Category).Include(e => e.CreditCard)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        if (expense is null) return NotFound();

        return ToDto(expense);
    }

    [HttpPost]
    public async Task<ActionResult<CreditCardExpenseDto>> Create(CreditCardExpenseUpsertDto dto)
    {
        var expense = new CreditCardExpense
        {
            Description = dto.Description,
            Amount = dto.Amount,
            Date = dto.Date,
            CategoryId = dto.CategoryId,
            CreditCardId = dto.CreditCardId
        };
        db.CreditCardExpenses.Add(expense);
        await db.SaveChangesAsync();
        await db.Entry(expense).Reference(e => e.Category).LoadAsync();
        await db.Entry(expense).Reference(e => e.CreditCard).LoadAsync();

        var result = ToDto(expense);
        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CreditCardExpenseUpsertDto dto)
    {
        var expense = await db.CreditCardExpenses.FindAsync(id);
        if (expense is null) return NotFound();

        expense.Description = dto.Description;
        expense.Amount = dto.Amount;
        expense.Date = dto.Date;
        expense.CategoryId = dto.CategoryId;
        expense.CreditCardId = dto.CreditCardId;
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await db.CreditCardExpenses.FindAsync(id);
        if (expense is null) return NotFound();

        db.CreditCardExpenses.Remove(expense);
        await db.SaveChangesAsync();

        return NoContent();
    }

    private static CreditCardExpenseDto ToDto(CreditCardExpense e) => new(
        e.Id, e.Description, e.Amount, e.Date,
        e.CategoryId, e.Category!.Name, e.Category.Color,
        e.CreditCardId, e.CreditCard!.Name);
}
