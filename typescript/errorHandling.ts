/*
  ============================================================
  ERROR HANDLING IN TYPESCRIPT
  ============================================================

  Same runtime rules as JavaScript.
  TypeScript adds:
    - typed custom errors
    - catch (err: unknown) + narrowing (strict / useUnknownInCatchVariables)
    - never for functions that always throw
    - Result / discriminated unions as an alternative to throw
    - asserts / assertion functions

  Prefer catching as unknown, then narrow with instanceof.
*/

/*
  ============================================================
  1) WHAT IS AN Error?
  ============================================================

  Error is a built-in constructor. Instances usually have:
    - name     string
    - message  string
    - stack?   string (engine-specific)
    - cause?   unknown (ES2022)

  Prefer throwing Error (or subclass), not bare strings.
*/

// const err = new Error("Something broke");
// console.log(err.name);    // "Error"
// console.log(err.message); // "Something broke"
// console.log(err.stack);
// console.log(err instanceof Error); // true

/*
  ============================================================
  2) throw — surfacing a failure
  ============================================================
*/

function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

// console.log(divide(10, 2)); // 5
// console.log(divide(10, 0)); // throws

/** Functions that always throw can be typed as `never`. */
function fail(message: string): never {
  throw new Error(message);
}

/*
  ============================================================
  3) try / catch / finally
  ============================================================

  In TS (especially with useUnknownInCatchVariables / strict):
    catch (err: unknown) { ... }

  Narrow before using .message / .stack.
*/

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function safeDivide(a: number, b: number): number | null {
  try {
    return divide(a, b);
  } catch (err: unknown) {
    console.error("caught:", getErrorMessage(err));
    return null;
  } finally {
    // cleanup always runs
    // console.log("finally always runs");
  }
}

// console.log(safeDivide(10, 2)); // 5
// console.log(safeDivide(10, 0)); // null

// function weird(): string {
//   try {
//     return "from try";
//   } finally {
//     return "from finally"; // overrides try return
//   }
// }

/*
  ============================================================
  4) BUILT-IN ERROR TYPES
  ============================================================

  Error, TypeError, ReferenceError, SyntaxError, RangeError,
  URIError, AggregateError (+ historical EvalError).
*/

// throw new Error("generic failure");

// const n: null = null;
// // console.log(n.prop); // TS may catch some of these at compile time

// try {
//   JSON.parse("{ bad json }");
// } catch (err: unknown) {
//   if (err instanceof SyntaxError) console.log(err.name); // SyntaxError
// }

// Promise.any([
//   Promise.reject(new Error("a")),
//   Promise.reject(new Error("b")),
// ]).catch((err: unknown) => {
//   if (err instanceof AggregateError) {
//     console.log(err.name);   // AggregateError
//     console.log(err.errors); // Error[]
//   }
// });

/*
  ============================================================
  5) INSPECTING / NARROWING ERRORS
  ============================================================
*/

function describeError(err: unknown): string {
  if (err instanceof TypeError) return "type problem: " + err.message;
  if (err instanceof RangeError) return "range problem: " + err.message;
  if (err instanceof AggregateError) {
    return (
      "many failures: " +
      err.errors.map((e) => (e instanceof Error ? e.message : String(e))).join("; ")
    );
  }
  if (err instanceof Error) return err.name + ": " + err.message;
  return "non-Error thrown: " + String(err);
}

// try {
//   (null as unknown as { x: number }).x;
// } catch (err: unknown) {
//   console.log(describeError(err));
// }

/** Type guard helper */
function isError(err: unknown): err is Error {
  return err instanceof Error;
}

/*
  ============================================================
  6) CUSTOM ERRORS (typed)
  ============================================================
*/

class ValidationError extends Error {
  readonly field: string;

  constructor(message: string, field: string) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class HttpError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }
}

type UserInput = {
  email?: string;
};

function registerUser(user: UserInput): { ok: true; email: string } {
  if (!user.email) {
    throw new ValidationError("email is required", "email");
  }
  return { ok: true, email: user.email };
}

// try {
//   registerUser({});
// } catch (err: unknown) {
//   if (err instanceof ValidationError) {
//     console.log("field:", err.field, "→", err.message);
//   } else {
//     throw err; // rethrow unknown
//   }
// }

/*
  ============================================================
  7) RETHROW, WRAP, cause
  ============================================================
*/

function parseConfig(json: string): unknown {
  try {
    return JSON.parse(json) as unknown;
  } catch (err: unknown) {
    throw new Error("Invalid config JSON", { cause: err });
  }
}

// try {
//   parseConfig("{not-json");
// } catch (err: unknown) {
//   if (err instanceof Error) {
//     console.log(err.message);
//     console.log(err.cause);
//   }
// }

/*
  ============================================================
  8) ASYNC ERROR HANDLING
  ============================================================

  try/catch does not catch later setTimeout throws.
  Rejected promises need await + try/catch or .catch().
*/

type User = {
  id: number;
  name: string;
};

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error("Invalid id"));
      else resolve({ id, name: "Andre" });
    }, 50);
  });
}

// fetchUser(-1)
//   .then((user) => console.log(user))
//   .catch((err: unknown) => console.error("promise catch:", getErrorMessage(err)))
//   .finally(() => console.log("settled"));

async function loadUser(id: number): Promise<User | null> {
  try {
    const user = await fetchUser(id);
    console.log("user:", user);
    return user;
  } catch (err: unknown) {
    console.error("async catch:", getErrorMessage(err));
    return null;
  }
}

// loadUser(1);
// loadUser(-1);

// fetchUser(-1); // bad: unhandled rejection

/*
  ============================================================
  9) ERROR EVENTS (last resort)
  ============================================================

  Browser: error / unhandledrejection
  Node: uncaughtException / unhandledRejection

  Prefer local handling; use global handlers for logging/shutdown only.
*/

// if (typeof window !== "undefined") {
//   window.addEventListener("unhandledrejection", (event) => {
//     console.error("unhandledrejection:", event.reason);
//   });
// }

/*
  ============================================================
  10) RESULT UNIONS (typed alternative to throw)
  ============================================================

  When failure is expected/common, a discriminated union is often clearer
  than exceptions — and TypeScript forces you to handle both branches.
*/

type Ok<T> = { ok: true; value: T };
type Err = { ok: false; error: string };
type Result<T> = Ok<T> | Err;

function parseAge(input: string): Result<number> {
  const age = Number(input);
  if (!Number.isFinite(age) || age < 0) {
    return { ok: false, error: "Invalid age" };
  }
  return { ok: true, value: age };
}

// const parsed = parseAge("21");
// if (parsed.ok) console.log(parsed.value);
// else console.log(parsed.error);

/*
  ============================================================
  11) ASSERTION FUNCTIONS
  ============================================================

  `asserts condition` tells the type checker that after the call,
  the condition is true (narrowing continues).
*/

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) throw new Error(message ?? "Assertion failed");
}

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError("Expected string");
  }
}

// const maybe: unknown = "hi";
// assertIsString(maybe);
// console.log(maybe.toUpperCase()); // maybe is string here

/*
  ============================================================
  12) GUARDS & DOMAIN HELPERS
  ============================================================
*/

function createOrder(
  items: unknown,
  userId: unknown,
): { items: unknown[]; userId: number } {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError("items required", "items");
  }
  if (typeof userId !== "number") {
    throw new TypeError("userId must be a number");
  }
  return { items, userId };
}

/*
  ============================================================
  13) OPTIONAL CHAINING & NULLISH
  ============================================================
*/

// type Profile = { city?: string };
// type MaybeUser = { profile?: Profile } | null;
// const user: MaybeUser = null;
// console.log(user?.profile?.city); // undefined
// console.log(user?.profile?.city ?? "unknown");

/*
  ============================================================
  14) JSON / NETWORK EXAMPLE
  ============================================================
*/

async function loadJson(url: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (err: unknown) {
    throw new Error(`Network failed for ${url}`, { cause: err });
  }

  if (!res.ok) {
    throw new HttpError(`HTTP ${res.status}`, res.status, url);
  }

  try {
    return (await res.json()) as unknown;
  } catch (err: unknown) {
    throw new Error("Response was not valid JSON", { cause: err });
  }
}

// loadJson("https://jsonplaceholder.typicode.com/todos/1")
//   .then((data) => console.log("todo:", data))
//   .catch((err: unknown) => {
//     if (err instanceof HttpError) console.error("http", err.status, err.message);
//     else console.error(getErrorMessage(err));
//   });

/*
  ============================================================
  15) GOTCHAS (JS + TS)
  ============================================================

  1) catch (err) { err.message } without narrowing → TS error (unknown)
  2) Empty catch {} swallows bugs
  3) throw "string" — avoid; loses types/stack usefulness
  4) try/catch is not for expected control flow — prefer Result / guards
  5) async needs await/.catch
  6) avoid return in finally
  7) don't match only on err.message strings — use instanceof / codes
  8) `any` in catch defeats the point — keep unknown + narrow
*/

/*
  ============================================================
  QUICK CHEAT SHEET
  ============================================================

  Create:     new Error(msg) / subclasses with readonly fields
  Raise:      throw err | fail(): never
  Sync:       try/catch(err: unknown)/finally + narrowing
  Async:      await + try/catch OR promise.catch
  Inspect:    instanceof, type guards, err.cause
  Expected:   Result<T> discriminated union
  Asserts:    asserts condition / asserts value is T

  Run demos:
    npx tsx typescript/errorHandling.ts
*/

export {
  HttpError,
  ValidationError,
  assert,
  assertIsString,
  createOrder,
  describeError,
  divide,
  fail,
  fetchUser,
  getErrorMessage,
  isError,
  loadJson,
  loadUser,
  parseAge,
  parseConfig,
  registerUser,
  safeDivide,
};

export type { Err, Ok, Result, User, UserInput };
