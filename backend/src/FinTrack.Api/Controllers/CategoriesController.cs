using FinTrack.Api.Dtos;
using FinTrack.Domain.Entities;
using FinTrack.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        var categories = await db.Categories
            .OrderBy(c => c.Type).ThenBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Type, c.Color))
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> GetById(int id)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return NotFound();

        return new CategoryDto(category.Id, category.Name, category.Type, category.Color);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(CategoryUpsertDto dto)
    {
        var category = new Category { Name = dto.Name, Type = dto.Type, Color = dto.Color };
        db.Categories.Add(category);
        await db.SaveChangesAsync();

        var result = new CategoryDto(category.Id, category.Name, category.Type, category.Color);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CategoryUpsertDto dto)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return NotFound();

        category.Name = dto.Name;
        category.Type = dto.Type;
        category.Color = dto.Color;
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return NotFound();

        db.Categories.Remove(category);
        await db.SaveChangesAsync();

        return NoContent();
    }
}
