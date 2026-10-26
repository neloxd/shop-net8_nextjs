using Microsoft.EntityFrameworkCore;
using RealPlaza.Api.Models;

namespace RealPlaza.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Tienda> Tiendas => Set<Tienda>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id").UseIdentityByDefaultColumn();
            entity.Property(x => x.NombreUsuario).HasColumnName("nombre_usuario").HasMaxLength(50).IsRequired();
            entity.Property(x => x.PasswordHash).HasColumnName("password_hash").HasMaxLength(300).IsRequired();
            entity.Property(x => x.Activo).HasColumnName("activo");
            entity.HasIndex(x => x.NombreUsuario).IsUnique();
        });
        modelBuilder.Entity<Tienda>(entity =>
        {
            entity.ToTable("tiendas");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id").UseIdentityByDefaultColumn();
            entity.Property(x => x.Nombre).HasColumnName("nombre").HasMaxLength(120).IsRequired();
            entity.Property(x => x.Categoria).HasColumnName("categoria").HasMaxLength(30).IsRequired();
            entity.Property(x => x.Activo).HasColumnName("activo");
            entity.Property(x => x.CreadoEn).HasColumnName("creado_en");
        });
    }
}
