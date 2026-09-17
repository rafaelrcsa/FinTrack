using FinTrack.Api.Dtos;
using FinTrack.Domain.Entities;
using FinTrack.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/incomes")]
public class IncomesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<IncomeDto>>> GetAll([FromQuery] int? year, [FromQuery] int? month)
    {
        var query = db.Incomes.Include(e => e.Category).AsNoTracking();

        IEnumerable<Income> incomes = await query.OrderBy(e => e.StartDate).ToListAsync();

        if (year is not null && month is not null)
        {
            incomes = incomes.Where(e => ((IRecurring)e).IsActiveInMonth(year.Value, month.Value));
        }

        return Ok(incomes.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<IncomeDto>> GetById(int id)
    {
        var income = await db.Incomes.Include(e => e.Category).AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);
        if (income is null) return NotFound();

        return ToDto(income);
    }

    [HttpPost]
    public async Task<ActionResult<IncomeDto>> Create(IncomeUpsertDto dto)
    {
        var income = new Income
        {
            Source = dto.Source,
            Amount = dto.Amount,
            Notes = dto.Notes,
            CategoryId = dto.CategoryId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };
        db.Incomes.Add(income);
        await db.SaveChangesAsync();
        await db.Entry(income).Reference(e => e.Category).LoadAsync();

        var result = ToDto(income);
        return CreatedAtAction(nameof(GetById), new { id = income.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, IncomeUpsertDto dto)
    {
        var income = await db.Incomes.FindAsync(id);
        if (income is null) return NotFound();

        income.Source = dto.Source;
        income.Amount = dto.Amount;
        income.Notes = dto.Notes;
        income.CategoryId = dto.CategoryId;
        income.StartDate = dto.StartDate;
        income.EndDate = dto.EndDate;
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var income = await db.Incomes.FindAsync(id);
        if (income is null) return NotFound();

        db.Incomes.Remove(income);
        await db.SaveChangesAsync();

        return NoContent();
    }

    private static IncomeDto ToDto(Income e) => new(
        e.Id, e.Source, e.Amount, e.Notes,
        e.CategoryId, e.Category!.Name, e.Category.Color,
        e.StartDate, e.EndDate);
}
