// Functional programming utilities

/**
 * Compose functions from right to left
 * compose(f, g, h)(x) = f(g(h(x)))
 * Higher-order function that returns a new function
 */
export const compose = (...fns) => (x) =>
  fns.reduceRight((acc, fn) => fn(acc), x);

/**
 * Pipe functions from left to right
 * pipe(f, g, h)(x) = h(g(f(x)))
 * Higher-order function that returns a new function
 */
export const pipe = (...fns) => (x) =>
  fns.reduce((acc, fn) => fn(acc), x);

/**
 * Curry a function - converts f(a, b, c) to f(a)(b)(c)
 * Higher-order function
 */
export const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried.apply(this, [...args, ...nextArgs]);
  };
};

/**
 * Deep clone an object to ensure immutability
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Map) {
    return new Map(
      Array.from(obj.entries()).map(([key, value]) => [key, deepClone(value)])
    );
  }
  if (obj instanceof Set) {
    return new Set(Array.from(obj).map(deepClone));
  }
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  );
};

/**
 * Update nested object immutably
 * Returns new object with updated path
 */
export const assocPath = (path, value, obj) => {
  if (path.length === 0) return value;
  const [head, ...tail] = path;
  return {
    ...obj,
    [head]: assocPath(tail, value, obj[head] || {})
  };
};

/**
 * Identity function - returns its argument
 */
export const identity = (x) => x;

/**
 * Constant function - returns a function that always returns x
 * Higher-order function
 */
export const constant = (x) => () => x;

/**
 * Predicate combinator - logical AND
 * Higher-order function that combines predicates
 */
export const allPass = (...predicates) => (x) =>
  predicates.every(pred => pred(x));

/**
 * Predicate combinator - logical OR
 * Higher-order function that combines predicates
 */
export const anyPass = (...predicates) => (x) =>
  predicates.some(pred => pred(x));
