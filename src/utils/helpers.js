import { SETS, AMBIGUOUS_CHARS } from "./constants.js";

// Cryptographically strong random int in [0, max)
export function getRandomInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max; // keeping current behavior (modulo) to avoid logic changes
}

// Secure Fisher–Yates shuffle
export function secureShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build selected character pools as arrays (after optional ambiguous filtering)
export function buildPools(options) {
  const selected = Object.entries(SETS)
    .filter(([key]) => options[key])
    .map(([, chars]) => chars.split(""));

  if (!options.excludeAmbiguous) return selected;

  return selected.map((pool) =>
    pool.filter((c) => !AMBIGUOUS_CHARS.includes(c))
  );
}

// Generate password guaranteeing at least one char from each enabled pool
export function generatePassword(length, options) {
  const pools = buildPools(options);
  const combined = pools.flat();
  if (combined.length === 0) return "";

  // one required from each pool (as length allows)
  const required = [];
  for (let i = 0; i < pools.length && required.length < length; i++) {
    const pool = pools[i];
    if (pool.length > 0) required.push(pool[getRandomInt(pool.length)]);
  }

  // fill the rest from combined pool
  const remaining = Math.max(0, length - required.length);
  const rest = Array.from(
    { length: remaining },
    () => combined[getRandomInt(combined.length)]
  );

  // shuffle to avoid predictable ordering
  return secureShuffle([...required, ...rest]).join("");
}
