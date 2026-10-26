# Validación de la entrega

## Resultado ejecutado

| Verificación | Resultado |
|---|---|
| Backend .NET 8, compilación Release | Correcta con SDK 8.0.426 / runtime 8.0.32. |
| Algoritmos | 53 comprobaciones aprobadas. |
| Frontend | ESLint sin errores ni advertencias, TypeScript y compilación de producción correctos. |
| SQL `init.sql` | Ejecutado dos veces: 1 usuario y 6 tiendas, sin duplicados. |
| API real .NET + EF Core/Npgsql | 27 comprobaciones HTTP aprobadas. |
| Navegador Chromium | 3 escenarios de extremo a extremo aprobados. |
| Vista móvil | Verificada a 390 × 844; sin desbordamiento del documento. La tabla permite desplazamiento horizontal. |
| Diagramas | XML draw.io válido, arquitectura y 3 páginas de secuencia; vistas renderizadas e inspeccionadas. |
| Instalador autocontenido y patch | Extracción/aplicación en directorio vacío, comparación de archivos y rechazo de sobrescritura verificados. |

## Qué cubren las pruebas

Algoritmos: ejemplos del PDF, entradas vacías o inválidas, duplicados, precisión monetaria, cultura, montos sin representación, ausencia de combinaciones duplicadas, suma correcta y comparación con un contador independiente de programación dinámica.

API: login válido con el usuario del SQL, login inválido, DTOs incorrectos, JWT ausente/adulterado/expirado, GET público, crear/consultar/editar/eliminar, código Location, cambio de estado, persistencia consultada y recursos inexistentes. La prueba crea su tienda y la elimina al terminar.

Navegador: acceso sin sesión, validaciones, contraseña incorrecta, cookie HttpOnly/SameSite, creación y edición, recarga, filtros, cancelación y confirmación de eliminación, logout, cookie inválida, rechazo de origen externo y modal móvil con Escape.

## Entorno y límites

La validación se ejecutó en Linux. La base utilizada en las pruebas de integración fue **PGlite (PostgreSQL compilado a WebAssembly) con su servidor de protocolo PostgreSQL**, accedida por la API real a través de **Npgsql**. No se utilizó una API simulada ni un repositorio en memoria de EF Core. El transporte de prueba se limitó a una conexión del pool y el SQL y las operaciones de la aplicación se ejecutaron en ese motor.

**Docker Desktop y PostgreSQL 16 nativo no estaban disponibles para ejecución en este entorno.** Queda pendiente comprobar el arranque de Docker y el script `crear_todo.sql` mediante `psql` en el Mac o Windows del evaluador. La configuración entregada usa PostgreSQL 16 en Docker, no PGlite; la dependencia de pruebas PGlite no se incluye en el proyecto.

El SDK .NET se compiló con MSBuild directo y los ejecutables generados se corrieron con `dotnet`. Esta forma evitó una limitación del proceso CLI en el entorno aislado; los comandos habituales `dotnet run` y `dotnet build` están documentados para el equipo local.

No se ejecutó una prueba de carga, auditoría de seguridad, despliegue público ni una ejecución nativa sobre macOS/Windows. Tampoco se afirma haber enumerado completamente todas las combinaciones de montos monetarios grandes; su coste es combinatorio.

Los comandos reproducibles están en el README y en `scripts/verificar.sh`, `scripts/smoke-api.mjs` y `frontend/tests/tiendas.spec.ts`.
