import { test, expect } from "@playwright/test";

test("login, validaciones, CRUD persistente, filtros y logout", async ({ page }) => {
  await page.goto("/tiendas");
  await expect(page).toHaveURL(/\/login/);
  await page.getByRole("button", { name: "Ingresar al directorio" }).click();
  await expect(page.getByText("Ingresa tu usuario.", { exact: true })).toBeVisible();
  await page.getByLabel("Usuario", { exact: true }).fill("admin");
  await page.getByLabel("Contraseña", { exact: true }).fill("incorrecta");
  await page.getByRole("button", { name: "Ingresar al directorio" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Usuario o contraseña incorrectos." })).toBeVisible();
  await page.getByLabel("Contraseña", { exact: true }).fill("AdminDemo!2026");
  await page.getByRole("button", { name: "Ingresar al directorio" }).click();
  await expect(page.getByRole("heading", { name: "Directorio de tiendas." })).toBeVisible();
  const cookie = (await page.context().cookies()).find(c => c.name === "rp_session");
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Strict");
  expect(await page.evaluate(() => document.cookie)).not.toContain("rp_session");
  const name = `QA visual ${Date.now()}`;
  await page.getByRole("button", { name: "Nueva tienda", exact: true }).first().click();
  await page.getByRole("button", { name: "Guardar tienda" }).click();
  await expect(page.getByText("Ingresa un nombre de al menos 2 caracteres.")).toBeVisible();
  await expect(page.getByText("Selecciona una categoría.", { exact: true })).toBeVisible();
  await page.getByLabel("Nombre de la tienda").fill(name);
  await page.getByLabel("Categoría / Rubro").selectOption("Tecnología");
  await page.getByRole("button", { name: "Guardar tienda" }).click();
  await expect(page.getByRole("status")).toContainText("creó correctamente");
  await page.reload();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
  await page.getByLabel("Buscar tienda").fill(name);
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: `Editar ${name}`, exact: true }).click();
  await page.getByLabel("Nombre de la tienda").fill(name + " editada");
  await page.getByLabel("Tienda activa").uncheck();
  await page.getByRole("button", { name: "Guardar tienda" }).click();
  await expect(page.getByRole("status")).toContainText("guardaron correctamente");
  await expect(page.locator("tbody tr")).toContainText("Inactiva");
  await page.getByLabel("Filtrar por categoría").selectOption("Moda");
  await expect(page.getByText("No encontramos coincidencias")).toBeVisible();
  await page.getByLabel("Filtrar por categoría").selectOption("Tecnología");
  await page.getByRole("button", { name: `Eliminar ${name} editada`, exact: true }).click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(page.getByText(name + " editada", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: `Eliminar ${name} editada`, exact: true }).click();
  await page.getByRole("button", { name: "Eliminar tienda", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("eliminó correctamente");
  await page.reload();
  await expect(page.getByText(name + " editada", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.goto("/tiendas");
  await expect(page).toHaveURL(/\/login/);
});

test("cookie inválida y rechazo de origen externo", async ({ page, request }) => {
  await page.context().addCookies([{ name: "rp_session", value: "invalid.jwt.token", domain: "localhost", path: "/" }]);
  await page.goto("/tiendas");
  await expect(page).toHaveURL(/\/login/);
  const denied = await request.post("/api/auth/login", {
    headers: { Origin: "https://otro-origen.example" }, data: { usuario: "admin", password: "AdminDemo!2026" },
  });
  expect(denied.status()).toBe(403);
});

test("vista móvil sin desbordamiento y modal accesible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByLabel("Usuario", { exact: true }).fill("admin");
  await page.getByLabel("Contraseña", { exact: true }).fill("AdminDemo!2026");
  await page.getByRole("button", { name: "Ingresar al directorio" }).click();
  await expect(page.getByRole("heading", { name: "Directorio de tiendas." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Nueva tienda", exact: true }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
