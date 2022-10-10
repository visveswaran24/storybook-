/**
 * Mimicking the satisfies operator.
 */
export function satisfies<A>() {
  return <T extends A>(x: T) => x;
}
