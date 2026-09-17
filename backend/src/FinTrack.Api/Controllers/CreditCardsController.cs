using FinTrack.Api.Dtos;
using FinTrack.Domain.Entities;
using FinTrack.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/credit-cards")]
public class CreditCardsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CreditCardDto>>> GetAll()
    {
        var cards = await db.CreditCards
            .OrderBy(c => c.Name)
            .Select(c => new CreditCardDto(c.Id, c.Name))
            .ToListAsync();

        return Ok(cards);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CreditCardDto>> GetById(int id)
    {
        var card = await db.CreditCards.FindAsync(id);
        if (card is null) return NotFound();

        return new CreditCardDto(card.Id, card.Name);
    }

    [HttpPost]
    public async Task<ActionResult<CreditCardDto>> Create(CreditCardUpsertDto dto)
    {
        var card = new CreditCard { Name = dto.Name };
        db.CreditCards.Add(card);
        await db.SaveChangesAsync();

        var result = new CreditCardDto(card.Id, card.Name);
        return CreatedAtAction(nameof(GetById), new { id = card.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CreditCardUpsertDto dto)
    {
        var card = await db.CreditCards.FindAsync(id);
        if (card is null) return NotFound();

        card.Name = dto.Name;
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var card = await db.CreditCards.FindAsync(id);
        if (card is null) return NotFound();

        db.CreditCards.Remove(card);
        await db.SaveChangesAsync();

        return NoContent();
    }
}
