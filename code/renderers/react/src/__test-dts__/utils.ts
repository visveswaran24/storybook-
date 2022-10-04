// Inspired by: https://github.com/vuejs/core/blob/main/test-dts/index.d.ts

export function describe(name: string, fn: () => void): void {}
export function test(name: string, fn: () => void): void {}

export function expectAssignable<T>(value: T): void {}
type IsAny<T> = T extends true ? (T extends false ? true : never) : never;

/**
 * Mimicking the satisfies operator.
 */
export function satisfies<A>() {
  return <T extends A>(x: T) => x;
}
