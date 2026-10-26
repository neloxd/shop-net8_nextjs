using System.ComponentModel.DataAnnotations;

namespace RealPlaza.Api.Contracts;

public sealed record LoginRequest(
    [Required, StringLength(50)] string Usuario,
    [Required, StringLength(128)] string Password);

public sealed record LoginResponse(string Token, DateTime ExpiresAt, string Usuario);

public sealed record TiendaRequest(
    [Required, StringLength(120, MinimumLength = 2)] string Nombre,
    [Required, RegularExpression("^(Moda|Restaurantes|Tecnología|Hogar)$", ErrorMessage = "Selecciona una categoría válida.")] string Categoria,
    [Required] bool? Activo);

public sealed record TiendaResponse(int Id, string Nombre, string Categoria, bool Activo, DateTime CreadoEn);
