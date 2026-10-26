# Reto técnico — Gestión de tiendas

Aplicación de gestión de tiendas con ASP.NET Core 8, PostgreSQL y Next.js. Incluye inicio de sesión, consulta, creación, edición y eliminación de tiendas, además de los ejercicios `OrderRange` y `MoneyParts`.

## Requisitos

- .NET SDK 8.
- Node.js 24 y npm.
- Docker con Docker Compose v2.
- Git.

Los comandos usan Bash o Zsh en macOS/Linux. En Windows, ejecutarlos desde WSL2 con las herramientas instaladas en ese entorno y Docker Desktop integrado con WSL2.

Abrir Docker Desktop o iniciar el servicio de Docker antes de continuar.

## 1. Clonar el proyecto

Reemplazar `URL_DEL_REPOSITORIO` por la URL de este repositorio:

```bash
git clone https://github.com/neloxd/shop-net8_nextjs
cd shop-net8_nextjs
```

## 2. Configurar las variables de entorno

Desde la raíz del proyecto:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
node -e 'require("node:fs").appendFileSync(".env", "\nJwt__Key=" + require("node:crypto").randomBytes(32).toString("hex") + "\n")'
```

Este paso se realiza una vez después de clonar. Crea la configuración local y genera una clave JWT aleatoria. Los archivos `.env` y `frontend/.env.local` están excluidos de Git.

## 3. Iniciar PostgreSQL y crear la base

Desde la raíz:

```bash
docker compose up -d --wait --wait-timeout 120 db
```

Docker inicia PostgreSQL 16 y crea la base `realplaza`. En la primera inicialización, ejecuta automáticamente `database/init.sql`, que crea las tablas y carga un usuario de prueba y seis tiendas.

| Conexión local | Valor |
| --- | --- |
| Servidor | `127.0.0.1` |
| Puerto | `54329` |
| Base de datos | `realplaza` |
| Usuario de PostgreSQL | `realplaza` |
| Contraseña | Valor de `POSTGRES_PASSWORD` en `.env` |

No es necesario instalar PostgreSQL directamente en el equipo. Los datos se conservan en un volumen de Docker. El SQL de inicialización se ejecuta automáticamente solo cuando ese volumen está vacío.

## 4. Iniciar el backend

En la misma terminal, desde la raíz:

```bash
set -a
source .env
set +a

dotnet restore backend/RealPlaza.Api --locked-mode
dotnet run --project backend/RealPlaza.Api --no-restore -- --urls http://127.0.0.1:5080
```

Mantener esta terminal abierta. La API estará disponible en `http://127.0.0.1:5080`.

## 5. Iniciar el frontend

Abrir otra terminal en la raíz del proyecto:

```bash
cd frontend
npm ci
npm run dev
```

Mantener esta terminal abierta y acceder a **http://localhost:3000**.

## 6. Credenciales de acceso (esto pueden modificarlo desde bd)

| Campo | Valor |
| --- | --- |
| Usuario | `admin` |
| Contraseña | `AdminDemo!2026` |

Son las credenciales del usuario de prueba de la aplicación.

## Ejercicios en C#

Los archivos se encuentran en `algorithms/OrderRange.cs` y `algorithms/MoneyParts.cs`. Se ejecutan desde la raíz sin necesidad de iniciar la aplicación web:

```bash
# Ejecutar los ejemplos de ambos ejercicios
dotnet run --project algorithms

# Mostrar las combinaciones para S/ 0.50
dotnet run --project algorithms -- money 0.5
```

## Archivos SQL

- `database/init.sql`: tablas, restricciones, índices y datos iniciales. Docker lo ejecuta automáticamente.
- `database/crear_todo.sql`: script completo para crear la base, las tablas y los datos mediante `psql`. Se incluye como entregable SQL; no hace falta ejecutarlo adicionalmente al usar Docker.

## Detener y volver a iniciar

Presionar `Ctrl+C` en las terminales del backend y del frontend. Desde la raíz, detener PostgreSQL:

```bash
docker compose stop db
```

Para iniciar nuevamente, repetir los pasos 3 a 5. Se conservarán la configuración y los datos.

