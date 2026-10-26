using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealPlaza.Api.Contracts;
using RealPlaza.Api.Services;

namespace RealPlaza.Api.Controllers;

[ApiController]
[Route("api/tiendas")]
public sealed class TiendasController(TiendaService tiendas) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<TiendaResponse>>> List(CancellationToken ct) => Ok(await tiendas.ListAsync(ct));

    [HttpGet("{id:int:min(1)}")]
    [AllowAnonymous]
    public async Task<ActionResult<TiendaResponse>> Get(int id, CancellationToken ct)
    {
        var tienda = await tiendas.GetAsync(id, ct);
        return tienda is null ? NotFound(new { message = "La tienda no existe." }) : Ok(tienda);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<TiendaResponse>> Create(TiendaRequest request, CancellationToken ct)
    {
        if (request.Nombre.Trim().Length < 2) return InvalidName();
        var tienda = await tiendas.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = tienda.Id }, tienda);
    }

    [HttpPut("{id:int:min(1)}")]
    [Authorize]
    public async Task<ActionResult<TiendaResponse>> Update(int id, TiendaRequest request, CancellationToken ct)
    {
        if (request.Nombre.Trim().Length < 2) return InvalidName();
        var tienda = await tiendas.UpdateAsync(id, request, ct);
        return tienda is null ? NotFound(new { message = "La tienda no existe." }) : Ok(tienda);
    }

    [HttpDelete("{id:int:min(1)}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken ct) =>
        await tiendas.DeleteAsync(id, ct) ? NoContent() : NotFound(new { message = "La tienda no existe." });

    private BadRequestObjectResult InvalidName() => BadRequest(new { message = "El nombre debe tener entre 2 y 120 caracteres." });
}
