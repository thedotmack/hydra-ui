import type { AccountFn } from "./types";

export type Try<T, E> = T | E;

function isPromiseLike(obj: unknown): obj is PromiseLike<unknown> {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof (obj as { then?: unknown }).then === "function"
  );
}

function tryify<T, E>(fn: PromiseLike<T>, e?: E): PromiseLike<Try<T, E>> {
  return fn.then(
    (v: T) => v,
    (err: E) => e ?? err
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
): Try<T, Error> | PromiseLike<Try<T, Error>> => {
  if (isPromiseLike(fn)) return tryify(fn);
  try {
    const v = fn();
    if (isPromiseLike(v)) return tryify<T, Error>(v);
    return v;
  } catch (err) {
    return new Error(String(err));
  }
};

export const tryNull = async <T>(
  fn: PromiseLike<T> | (() => T | PromiseLike<T>),
  errorHandler?: (e: Error) => void
): Promise<Try<T, null> | PromiseLike<Try<T, null>>> => {
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
