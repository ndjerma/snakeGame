// Functional programming utilities

/**
 * Pipe functions from left to right
 * Chains functions together so output of one becomes input of next
 * Example: pipe(f, g, h)(x) = h(g(f(x)))
 */
export const pipe = (...fns) => (x) =>
  fns.reduce((acc, fn) => fn(acc), x);
