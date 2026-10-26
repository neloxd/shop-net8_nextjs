using Microsoft.EntityFrameworkCore;
using RealPlaza.Api.Contracts;
using RealPlaza.Api.Data;
using RealPlaza.Api.Models;

namespace RealPlaza.Api.Services;

public sealed class TiendaService(AppDbContext db)
{
    public async Task<List<TiendaResponse>> ListAsync(CancellationToken ct) =>
        await db.Tiendas.AsNoTracking().OrderBy(x => x.Nombre).ThenBy(x => x.Id)
            .Select(x => new TiendaResponse(x.Id, x.Nombre, x.Categoria, x.Activo, x.CreadoEn)).ToListAsync(ct);

    public async Task<TiendaResponse?> GetAsync(int id, CancellationToken ct)
    {
        var tienda = await db.Tiendas.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id, ct);
        return tienda is null ? null : Map(tienda);
    }

    public async Task<TiendaResponse> CreateAsync(TiendaRequest request, CancellationToken ct)
    {
        var tienda = new Tienda { Nombre = request.Nombre.Trim(), Categoria = request.Categoria, Activo = request.Activo!.Value };
        db.Tiendas.Add(tienda);
        await db.SaveChangesAsync(ct);
        return Map(tienda);
    }

    public async Task<TiendaResponse?> UpdateAsync(int id, TiendaRequest request, CancellationToken ct)
    {
        var tienda = await db.Tiendas.SingleOrDefaultAsync(x => x.Id == id, ct);
        if (tienda is null) return null;
        tienda.Nombre = request.Nombre.Trim();
        tienda.Categoria = request.Categoria;
        tienda.Activo = request.Activo!.Value;
        await db.SaveChangesAsync(ct);
        return Map(tienda);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct) =>
        await db.Tiendas.Where(x => x.Id == id).ExecuteDeleteAsync(ct) > 0;

    private static TiendaResponse Map(Tienda tienda) =>
        new(tienda.Id, tienda.Nombre, tienda.Categoria, tienda.Activo, tienda.CreadoEn);
}
