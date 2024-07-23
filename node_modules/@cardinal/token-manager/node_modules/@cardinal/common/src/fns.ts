import type { AccountFn } from "./types";

function isPromiseLike(obj: unknown): obj is PromiseLike<unknown> {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof (obj as { then?: unknown }).then === "function"
  );
}

function tryify<T>(fn: PromiseLike<T>): PromiseLike<T | Error> {
  return fn.then(
    (v: T) => v,
    (err: Error) => (isError(err) ? err : new Error(String(err)))
  );
}

export const isError = (e: unknown): e is Error => {
  return e instanceof Error;
};

/**
 * Wrap async function in try catch
 * @param p
 * @returns
 */
export const tryFn = <T>(
  fn: PromiseLike<T> | (() => T | PromiseLike<T>)
): T | Error | PromiseLike<T | Error> => {
  if (isPromiseLike(fn)) return tryify(fn);
  try {
    const v = fn();
    if (isPromiseLike(v)) return tryify(v);
    return v;
  } catch (err) {
    return new Error(String(err));
  }
};

export const tryNull = async <T>(
  fn: PromiseLike<T> | (() => T | PromiseLike<T>),
  errorHandler?: (e: Error) => void
): Promise<T | null | PromiseLike<T | null>> => {
  const v = await tryFn<T>(fn);
  if (isError(v)) {
    errorHandler && errorHandler(v);
    return null;
  }
  return v;
};

/**
 * Tries to get account based on function fn
 * Return null if account doesn't exist
 * @param fn
 * @returns
 */
export async function tryGetAccount<T>(fn: AccountFn<T>) {
  try {
    return await fn();
  } catch {
    return null;
  }
}
