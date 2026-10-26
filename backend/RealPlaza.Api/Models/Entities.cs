namespace RealPlaza.Api.Models;

public sealed class Usuario
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public bool Activo { get; set; } = true;
}

public sealed class Tienda
{
    public int Id { get; set; }
    public string Nombre { get; set; } = "";
    public string Categoria { get; set; } = "";
    public bool Activo { get; set; }
    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
}
