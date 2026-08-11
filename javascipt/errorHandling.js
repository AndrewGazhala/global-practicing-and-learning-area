/*
  ============================================================
  ERROR HANDLING IN JAVASCRIPT
  ============================================================

  Errors are normal: bad input, missing data, network failure, bugs.
  Without handling, an uncaught error stops the current task
  (and may crash a Node process or break a page script).

  Mental model:
    1) Something goes wrong → an Error object is created
    2) throw / reject surfaces it
    3) try/catch (sync) or .catch / try/catch around await (async)
       decide what to do next
    4) finally runs cleanup either way

  Goal of this file:
    understand Error objects, built-in types, throw/try/catch/finally,
    async errors, and practical patterns — uncomment demos to run.
*/


/*
  ============================================================
  1) WHAT IS AN Error?
  ============================================================

  Error is a built-in constructor. Instances usually have:
    - name     string  ("Error", "TypeError", ...)
    - message  string  human-readable description
    - stack    string  call stack (engine-specific, non-standard but everywhere)

  You can throw ANY value (string, number, object).
  Prefer throwing Error (or subclass) so you get stack + consistent shape.
*/

// const err = new Error("Something broke");
// console.log(err.name);    // "Error"
// console.log(err.message); // "Something broke"
// console.log(err.stack);   // stack trace string
// console.log(err instanceof Error); // true


/*
  ============================================================
  2) throw — surfacing a failure
  ============================================================

  throw stops the current function and unwinds the call stack
  until a matching catch (or the program/runtime handles it).
*/

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

// console.log(divide(10, 2)); // 5
// console.log(divide(10, 0)); // throws → uncaught unless try/catch


/*
  ============================================================
  3) try / catch / finally
  ============================================================

  try     — code that might throw
  catch   — runs if something threw inside try
  finally — ALWAYS runs (success, throw, or return from try/catch)

  catch binding:
    catch (err) { ... }   // err is the thrown value
    catch { ... }         // optional binding (ES2019) if you don't need the value
*/

function safeDivide(a, b) {
  try {
    return divide(a, b);
  } catch (err) {
    console.error("caught:", err.message);
    return null;
  } finally {
    // cleanup: close file, hide spinner, clear timer, etc.
    // console.log("finally always runs");
  }
}

// console.log(safeDivide(10, 2)); // 5
// console.log(safeDivide(10, 0)); // null (+ "caught: Division by zero")


/*
  finally + return quirks (know this):

  - finally runs even if try/catch return
  - if finally itself returns, it OVERRIDES try/catch return values
*/

// function weird() {
//   try {
//     return "from try";
//   } finally {
//     return "from finally"; // wins
//   }
// }
// console.log(weird()); // "from finally"


/*
  ============================================================
  4) BUILT-IN ERROR TYPES
  ============================================================

  All inherit from Error (err instanceof Error === true for these).
*/

/*
  --- Error ---
  Generic base. Use when no more specific type fits,
  or as the parent of your custom errors.
*/
// throw new Error("generic failure");

/*
  --- TypeError ---
  Value is the wrong type, or you used a value incorrectly
  (calling non-function, reading property of null/undefined, etc.).
*/
// const n = null;
// console.log(n.prop); // TypeError: Cannot read properties of null
//
// const notFn = 123;
// notFn(); // TypeError: notFn is not a function

/*
  --- ReferenceError ---
  Accessing a variable that doesn't exist (or TDZ for let/const).
*/
// console.log(doesNotExist); // ReferenceError: doesNotExist is not defined
//
// console.log(beforeInit); // ReferenceError (TDZ)
// let beforeInit = 1;

/*
  --- SyntaxError ---
  Invalid code structure. Usually happens at PARSE time,
  so you typically cannot catch it in the same file that has the bad syntax.

  You CAN catch SyntaxError from eval / JSON.parse / new Function:
*/
// try {
//   JSON.parse("{ bad json }");
// } catch (err) {
//   console.log(err.name); // SyntaxError
// }

/*
  --- RangeError ---
  Number / length out of allowed range.
*/
// new Array(-1);           // RangeError: Invalid array length
// (123).toFixed(200);      // RangeError: toFixed() digits argument...
// Number.parseInt("1", 1); // RangeError: radix must be ... (invalid radix)

/*
  --- URIError ---
  encodeURI / decodeURI / encodeURIComponent / decodeURIComponent misuse.
*/
// decodeURIComponent("%"); // URIError: URI malformed

/*
  --- AggregateError ---
  Groups multiple errors (e.g. Promise.any when ALL promises reject).
  Has .errors — an array of the underlying reasons.
*/
// Promise.any([
//   Promise.reject(new Error("a")),
//   Promise.reject(new Error("b")),
// ]).catch((err) => {
//   console.log(err.name);   // AggregateError
//   console.log(err.errors); // [Error: a, Error: b]
// });

/*
  --- EvalError ---
  Historical. Rarely thrown by modern engines for normal code.
  Still exists for compatibility; don't rely on it in new code.
*/


/*
  ============================================================
  5) INSPECTING / NARROWING ERRORS
  ============================================================

  Always assume catch receives "unknown shape" if libraries throw weird things.
  Prefer instanceof checks over comparing err.name strings alone.
*/

function describeError(err) {
  if (err instanceof TypeError) return "type problem: " + err.message;
  if (err instanceof RangeError) return "range problem: " + err.message;
  if (err instanceof AggregateError) {
    return "many failures: " + err.errors.map((e) => e.message).join("; ");
  }
  if (err instanceof Error) return err.name + ": " + err.message;
  return "non-Error thrown: " + String(err);
}

// try {
//   null.x;
// } catch (err) {
//   console.log(describeError(err));
// }


/*
  ============================================================
  6) CUSTOM ERRORS
  ============================================================

  Extend Error for domain-specific failures.
  Set this.name and (in older environments) fix the prototype chain.
*/

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class HttpError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }
}

function registerUser(user) {
  if (!user?.email) {
    throw new ValidationError("email is required", "email");
  }
  return { ok: true, email: user.email };
}

// try {
//   registerUser({});
// } catch (err) {
//   if (err instanceof ValidationError) {
//     console.log("field:", err.field, "→", err.message);
//   } else {
//     throw err; // rethrow unknown errors
//   }
// }


/*
  ============================================================
  7) RETHROW & ERROR BOUNDARIES (logical)
  ============================================================

  Catch only what you can handle. Rethrow the rest
  so higher layers (UI boundary, server middleware) can react.
*/

function parseConfig(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    // wrap with more context, keep original as cause (ES2022)
    throw new Error("Invalid config JSON", { cause: err });
  }
}

// try {
//   parseConfig("{not-json");
// } catch (err) {
//   console.log(err.message);      // Invalid config JSON
//   console.log(err.cause?.message); // original SyntaxError message
// }


/*
  ============================================================
  8) ASYNC ERROR HANDLING
  ============================================================

  try/catch around a function does NOT catch:
    - errors inside setTimeout callbacks scheduled later
    - rejected promises you did not await / .catch
*/

// --- WRONG: try/catch does not see the timeout throw ---
// try {
//   setTimeout(() => {
//     throw new Error("inside timeout");
//   }, 0);
// } catch (err) {
//   // never runs for the timeout throw
// }

// --- RIGHT: handle inside the async callback / promise chain ---
// setTimeout(() => {
//   try {
//     throw new Error("inside timeout");
//   } catch (err) {
//     console.error("timeout caught:", err.message);
//   }
// }, 0);

/*
  Promises: rejection ≈ throw
*/

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error("Invalid id"));
      else resolve({ id, name: "Andre" });
    }, 50);
  });
}

// A) .then / .catch
// fetchUser(-1)
//   .then((user) => console.log(user))
//   .catch((err) => console.error("promise catch:", err.message))
//   .finally(() => console.log("settled"));

// B) async/await + try/catch
async function loadUser(id) {
  try {
    const user = await fetchUser(id);
    console.log("user:", user);
    return user;
  } catch (err) {
    console.error("async catch:", err.message);
    return null;
  }
}

// loadUser(1);
// loadUser(-1);

/*
  Unhandled rejections:
    forgetting .catch / try/catch around await
    → browsers fire unhandledrejection
    → Node may warn and (depending on version/flags) exit
*/

// fetchUser(-1); // bad: unhandled rejection


/*
  ============================================================
  9) ERROR EVENTS (browser / Node)
  ============================================================

  Browser:
    window.addEventListener("error", ...)              // sync uncaught
    window.addEventListener("unhandledrejection", ...) // promise rejections

  Node:
    process.on("uncaughtException", ...)
    process.on("unhandledRejection", ...)

  These are last-resort safety nets — log, report, shut down gracefully.
  Prefer local try/catch and promise .catch for normal control flow.
*/

// if (typeof window !== "undefined") {
//   window.addEventListener("unhandledrejection", (event) => {
//     console.error("unhandledrejection:", event.reason);
//   });
// }
//
// if (typeof process !== "undefined") {
//   process.on("unhandledRejection", (reason) => {
//     console.error("unhandledRejection:", reason);
//   });
// }


/*
  ============================================================
  10) COMMON PATTERNS
  ============================================================
*/

// --- Guard clauses (fail fast, keep happy path flat) ---
function createOrder(items, userId) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError("items required", "items");
  }
  if (typeof userId !== "number") {
    throw new TypeError("userId must be a number");
  }
  return { items, userId };
}

// --- Result object instead of throw (when errors are expected) ---
function parseAge(input) {
  const age = Number(input);
  if (!Number.isFinite(age) || age < 0) {
    return { ok: false, error: "Invalid age" };
  }
  return { ok: true, value: age };
}

// console.log(parseAge("21"));  // { ok: true, value: 21 }
// console.log(parseAge("nope")); // { ok: false, error: "Invalid age" }

// --- Assert helper ---
function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

// assert(1 + 1 === 2, "math works");
// assert(false, "should never happen");

// --- Promise combinators and errors ---
// Promise.all  — fails fast on first rejection
// Promise.allSettled — never rejects for item failures; inspect status
// Promise.any  — AggregateError if all reject
// Promise.race — first settle wins (fulfill OR reject)


/*
  ============================================================
  11) OPTIONAL CHAINING & NULLISH — fewer TypeErrors
  ============================================================

  ?. and ?? prevent many "Cannot read properties of null/undefined"
*/

// const user = null;
// console.log(user?.profile?.city); // undefined (no throw)
// console.log(user?.profile?.city ?? "unknown"); // "unknown"


/*
  ============================================================
  12) JSON / NETWORK EXAMPLES
  ============================================================
*/

async function loadJson(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    // network / DNS / CORS / offline
    throw new Error(`Network failed for ${url}`, { cause: err });
  }

  if (!res.ok) {
    throw new HttpError(`HTTP ${res.status}`, res.status, url);
  }

  try {
    return await res.json();
  } catch (err) {
    throw new Error("Response was not valid JSON", { cause: err });
  }
}

// loadJson("https://jsonplaceholder.typicode.com/todos/1")
//   .then((data) => console.log("todo:", data))
//   .catch((err) => {
//     if (err instanceof HttpError) console.error("http", err.status, err.message);
//     else console.error(err.message, err.cause);
//   });


/*
  ============================================================
  13) GOTCHAS
  ============================================================

  1) catch (err) { throw err.message } — loses stack; rethrow Error or original
  2) Empty catch {} — swallows bugs; at least log
  3) throw "string" — works, but poor debugging; throw new Error(...)
  4) try/catch is not for normal branching of expected values — prefer if/guards
  5) async errors need await/.catch — try/catch alone won't see later callbacks
  6) finally should not become a second control-flow maze (avoid return in finally)
  7) Comparing err.message strings is brittle — prefer instanceof / error codes
*/


/*
  ============================================================
  QUICK CHEAT SHEET
  ============================================================

  Create:     new Error(msg) / new TypeError(msg) / custom class
  Raise:      throw err
  Sync:       try { ... } catch (err) { ... } finally { ... }
  Async:      await + try/catch   OR   promise.catch(...)
  Inspect:    instanceof, err.name, err.message, err.cause, err.stack
  Wrap:       throw new Error("context", { cause: original })
  Expected:   Result { ok, value|error } when failure is normal
  Last resort: unhandledrejection / uncaughtException handlers

  How to study:
    1) read one section
    2) uncomment its demos
    3) predict output / which Error type
    4) run: node javascipt/errorHandling.js
*/
