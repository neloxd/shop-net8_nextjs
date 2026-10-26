using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using RealPlaza.Api.Contracts;
using RealPlaza.Api.Data;
using RealPlaza.Api.Security;

namespace RealPlaza.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(AppDbContext db, PasswordService passwords, TokenService tokens) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, CancellationToken ct)
    {
        var username = request.Usuario.Trim().ToLowerInvariant();
        var usuario = await db.Usuarios.AsNoTracking().SingleOrDefaultAsync(x => x.NombreUsuario == username, ct);
        var valid = passwords.Verify(request.Password, usuario?.PasswordHash ?? DummyHash);
        if (usuario is null || !usuario.Activo || !valid)
            return Unauthorized(new { message = "Usuario o contraseña incorrectos." });
        return Ok(tokens.Create(usuario));
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new { usuario = User.Identity!.Name });

    private const string DummyHash = "pbkdf2-sha256$600000$MDEyMzQ1Njc4OWFiY2RlZg==$MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=";
}
