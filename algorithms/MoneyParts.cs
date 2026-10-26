using System;
using System.Collections.Generic;
using System.Globalization;

public sealed class MoneyParts
{
    private static readonly int[] Denominations = [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

    public IEnumerable<IReadOnlyList<decimal>> Build(string amount)
    {
        ArgumentNullException.ThrowIfNull(amount);
        var value = amount.Trim();
        if (!decimal.TryParse(value, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out var soles) || soles < 0)
            throw new ArgumentException("Usa un monto no negativo con punto decimal, por ejemplo 0.50.", nameof(amount));
        if (soles > int.MaxValue / 100m || soles * 100m != decimal.Truncate(soles * 100m))
            throw new ArgumentOutOfRangeException(nameof(amount), "El monto debe tener precisión de céntimos y estar dentro del rango admitido.");
        var cents = (int)(soles * 100m);
        if (cents % 5 != 0) return Array.Empty<IReadOnlyList<decimal>>();
        return Enumerate(cents, Denominations.Length - 1, new int[Denominations.Length]);
    }

    private static IEnumerable<IReadOnlyList<decimal>> Enumerate(int remaining, int index, int[] counts)
    {
        if (index == 0)
        {
            counts[0] = remaining / Denominations[0];
            var combination = new List<decimal>();
            for (var i = 0; i < counts.Length; i++)
                for (var n = 0; n < counts[i]; n++)
                    combination.Add(Denominations[i] / 100m);
            yield return combination;
            yield break;
        }
        for (var count = 0; count <= remaining / Denominations[index]; count++)
        {
            counts[index] = count;
            foreach (var combination in Enumerate(remaining - count * Denominations[index], index - 1, counts))
                yield return combination;
        }
    }
}
