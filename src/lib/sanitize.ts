/**
 * Converts empty-string values to `undefined` before a Drizzle insert/update.
 * Client forms routinely submit `''` for an untouched optional field, and
 * Postgres rejects `''` outright for `date`/`time` columns (and it's a
 * worse-than-NULL value for nullable text columns either way).
 */
export function nullifyEmptyStrings<T extends Record<string, unknown>>(input: T): T {
  const result = { ...input };
  for (const key of Object.keys(result) as (keyof T)[]) {
    if (result[key] === "") {
      result[key] = undefined as T[keyof T];
    }
  }
  return result;
}
