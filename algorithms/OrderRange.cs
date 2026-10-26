using System;
using System.Collections.Generic;
using System.Linq;

public sealed class OrderRange
{
    public (IReadOnlyList<int> Impares, IReadOnlyList<int> Pares) Build(IEnumerable<int> numbers)
    {
        ArgumentNullException.ThrowIfNull(numbers);
        var values = numbers.ToArray();
        if (values.Any(value => value <= 0))
            throw new ArgumentOutOfRangeException(nameof(numbers), "Solo se permiten enteros positivos.");
        return (values.Where(value => value % 2 != 0).OrderBy(value => value).ToArray(),
            values.Where(value => value % 2 == 0).OrderBy(value => value).ToArray());
    }
}
