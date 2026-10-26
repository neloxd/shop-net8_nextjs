using System.Globalization;
using System.Text.Json;

if (args.Contains("--self-test"))
{
    var assertions = 0;
    void Check(bool condition, string name)
    {
        if (!condition) throw new InvalidOperationException($"FALLÓ: {name}");
        assertions++;
    }
    void Throws<T>(Action action, string name) where T : Exception
    {
        try { action(); }
        catch (T) { assertions++; return; }
        throw new InvalidOperationException($"FALLÓ: {name}");
    }
    var sorter = new OrderRange();
    var first = sorter.Build([2, 1, 4, 5]);
    Check(first.Impares.SequenceEqual([1, 5]) && first.Pares.SequenceEqual([2, 4]), "Ordenamiento ejemplo 1");
    var second = sorter.Build([4, 2, 9, 3, 6]);
    Check(second.Impares.SequenceEqual([3, 9]) && second.Pares.SequenceEqual([2, 4, 6]), "Ordenamiento ejemplo 2");
    var third = sorter.Build([58, 60, 55, 48, 57, 73]);
    Check(third.Impares.SequenceEqual([55, 57, 73]) && third.Pares.SequenceEqual([48, 58, 60]), "Ordenamiento ejemplo 3");
    Check(sorter.Build([2, 2, 1, 1]).Pares.SequenceEqual([2, 2]), "Conserva duplicados");
    Check(sorter.Build([]).Impares.Count == 0, "Colección vacía");
    Check(sorter.Build([int.MaxValue]).Impares.Single() == int.MaxValue, "Entero máximo");
    Throws<ArgumentNullException>(() => sorter.Build(null!), "Colección nula");
    Throws<ArgumentOutOfRangeException>(() => sorter.Build([0]), "Cero fuera del contrato");
    Throws<ArgumentOutOfRangeException>(() => sorter.Build([-1]), "Negativos fuera del contrato");

    var money = new MoneyParts();
    var ten = money.Build("0.1").ToArray();
    Check(ten.Length == 2 && ten[0].SequenceEqual([0.05m, 0.05m]) && ten[1].SequenceEqual([0.10m]), "Monedas ejemplo 0.1");
    Check(money.Build("0.5").Count() == 13, "13 combinaciones de 0.5");
    Check(money.Build("0").Single().Count == 0, "Cero: una combinación vacía");
    Check(!money.Build("0.03").Any(), "Monto sin combinación exacta");
    Throws<ArgumentNullException>(() => money.Build(null!), "Monto nulo");
    Throws<ArgumentException>(() => money.Build("texto"), "Formato inválido");
    Throws<ArgumentException>(() => money.Build("-1"), "Monto negativo");
    Throws<ArgumentException>(() => money.Build("1,50"), "Separador decimal explícito");
    Throws<ArgumentOutOfRangeException>(() => money.Build("0.001"), "Fracciones de céntimo");
    Throws<ArgumentOutOfRangeException>(() => money.Build("999999999"), "Fuera de rango");
    var previousCulture = CultureInfo.CurrentCulture;
    CultureInfo.CurrentCulture = CultureInfo.GetCultureInfo("es-PE");
    Check(money.Build("0.10").Count() == 2, "Independiente de cultura");
    CultureInfo.CurrentCulture = previousCulture;
    int[] denominations = [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    foreach (var cents in new[] { 5, 10, 15, 20, 50, 100, 200, 500 })
    {
        var combinations = money.Build((cents / 100m).ToString(CultureInfo.InvariantCulture)).ToArray();
        var counts = new long[cents + 1];
        counts[0] = 1;
        foreach (var denomination in denominations)
            for (var amount = denomination; amount <= cents; amount++) counts[amount] += counts[amount - denomination];
        Check(combinations.Length == counts[cents], $"Total contrastado por programación dinámica: {cents}");
        Check(combinations.All(c => c.Sum() == cents / 100m), $"Suma exacta: {cents}");
        Check(combinations.All(c => c.SequenceEqual(c.Order())), $"Orden canónico: {cents}");
        Check(combinations.Select(c => string.Join(",", c)).Distinct().Count() == combinations.Length, $"Sin duplicados: {cents}");
    }
    Check(money.Build("200").Take(1).Single().Sum() == 200m, "Enumeración diferida de monto grande");
    Console.WriteLine($"OK: {assertions} comprobaciones de algoritmos.");
    return;
}

if (args.Length > 0 && args[0] == "money")
{
    var amount = args.Length > 1 ? args[1] : "0.5";
    foreach (var combination in new MoneyParts().Build(amount))
        Console.WriteLine(JsonSerializer.Serialize(combination));
    return;
}
var result = new OrderRange().Build([58, 60, 55, 48, 57, 73]);
Console.WriteLine(JsonSerializer.Serialize(new { result.Impares, result.Pares }));
Console.WriteLine(JsonSerializer.Serialize(new MoneyParts().Build("0.1")));
