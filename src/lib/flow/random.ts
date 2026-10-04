/** Standard normal sample (Box–Muller). `1 - random()` keeps log() off zero. */
export function gauss(sigma = 1): number {
  return (
    Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()) * sigma
  );
}
