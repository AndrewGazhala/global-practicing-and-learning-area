/*
  ============================================================
  ASYNCHRONOUS JAVASCRIPT — HOW IT WORKS
  ============================================================

  JS runs on a SINGLE THREAD (one call stack).
  Long tasks (network, timers, file I/O) would freeze the UI
  if they blocked that thread.

  So JS is designed as:
    - synchronous by default (line by line on the call stack)
    - asynchronous for waiting work (timers, fetch, events…)

  "Async" does NOT mean multi-threaded JS code.
  It means: start work → continue other code → handle result later.

  Who does the waiting?
    Browser / Node provide Web APIs / libuv.
    When work finishes, a callback/promise job is queued.
    The EVENT LOOP picks it up when the call stack is empty.
*/


/*
  ============================================================
  EVENT LOOP (core mental model)
  ============================================================

  Pieces:
    1) Call Stack     — currently running functions
    2) Web APIs       — timers, fetch, DOM events, etc.
    3) Task Queue     — macrotasks (setTimeout, setInterval, I/O, UI events)
    4) Microtask Queue — promises (.then/catch/finally), queueMicrotask, MutationObserver
    5) Event Loop     — scheduler that decides what runs next

  One loop tick (simplified):

    while (true) {
      // 1. Run all synchronous code on the call stack
      // 2. When stack is empty:
      //    - drain ALL microtasks
      //    - then take ONE macrotask
      //    - then drain microtasks again
      //    - (browser may render between macrotasks)
    }

  Priority:
    Call Stack  >  Microtasks  >  Macrotasks

  Classic order demo (uncomment to run):
*/

// console.log("1 sync");
//
// setTimeout(() => console.log("4 macrotask (timeout)"), 0);
//
// Promise.resolve().then(() => console.log("3 microtask (promise)"));
//
// queueMicrotask(() => console.log("3b microtask (queueMicrotask)"));
//
// console.log("2 sync");
//
// Expected order:
//   1 sync
//   2 sync
//   3 microtask (promise)
//   3b microtask (queueMicrotask)
//   4 macrotask (timeout)


/*
  Visual timeline for the demo above:

  Time →
  Call stack:  log(1) → schedule timeout → schedule promise → schedule microtask → log(2) → empty
  Microtasks:  [promise] [queueMicrotask]  → both run before any timeout
  Macrotasks:  [timeout 0]                 → runs after microtasks are empty
*/


/*
  ============================================================
  OPTION 1 — CALLBACKS (oldest style)
  ============================================================
*/

function fetchUserCallback(id, callback) {
  // simulate async work with setTimeout (macrotask)
  setTimeout(() => {
    if (id <= 0) {
      callback(new Error("Invalid id"), null);
      return;
    }
    callback(null, { id, name: "Andre" });
  }, 100);
}

// Success
// fetchUserCallback(1, (err, user) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   console.log("callback user:", user);
// });

// Error
// fetchUserCallback(-1, (err, user) => {
//   if (err) console.error("callback error:", err.message);
//   else console.log(user);
// });


/*
  Callback Hell (nested callbacks — hard to read/maintain)
*/

// fetchUserCallback(1, (err, user) => {
//   if (err) return console.error(err);
//   fetchUserCallback(user.id + 1, (err2, user2) => {
//     if (err2) return console.error(err2);
//     fetchUserCallback(user2.id + 1, (err3, user3) => {
//       if (err3) return console.error(err3);
//       console.log("nested result:", user3);
//     });
//   });
// });


/*
  ============================================================
  OPTION 2 — TIMERS (macrotasks)
  setTimeout / setInterval / clearTimeout / clearInterval
  ============================================================
*/

// setTimeout(() => {
//   console.log("runs once after ~200ms");
// }, 200);

// const intervalId = setInterval(() => {
//   console.log("runs every 300ms");
// }, 300);
//
// setTimeout(() => clearInterval(intervalId), 1000); // stop after ~1s

// Delay helper (promisified timer)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// delay(150).then(() => console.log("delayed with promise wrapper"));


/*
  ============================================================
  OPTION 3 — PROMISES
  ============================================================

  A Promise is an object representing a future value.
  States: pending → fulfilled | rejected  (settled, one-way)

  Creating:
*/

const promiseOk = new Promise((resolve, reject) => {
  // executor runs sync immediately
  resolve("done");
});

const promiseFail = new Promise((resolve, reject) => {
  reject(new Error("boom"));
});

// Consuming with then / catch / finally
// promiseOk
//   .then((value) => {
//     console.log("then:", value);
//     return value.toUpperCase(); // return passes to next then
//   })
//   .then((upper) => console.log("chained:", upper))
//   .catch((err) => console.error("catch:", err.message))
//   .finally(() => console.log("finally always runs"));

// promiseFail
//   .then((v) => console.log(v))
//   .catch((err) => console.error("caught:", err.message));


/*
  Shortcut constructors
*/

// Promise.resolve(42).then(console.log);
// Promise.reject(new Error("nope")).catch((e) => console.error(e.message));


/*
  Fetch-like example with Promise
*/

function fetchUserPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error("Invalid id"));
      else resolve({ id, name: "Andre" });
    }, 100);
  });
}

// fetchUserPromise(1)
//   .then((user) => {
//     console.log("promise user:", user);
//     return fetchUserPromise(user.id + 1);
//   })
//   .then((user2) => console.log("next user:", user2))
//   .catch((err) => console.error(err.message));


/*
  ============================================================
  OPTION 4 — PROMISE COMBINATORS
  ============================================================
*/

const p1 = () => delay(100).then(() => "A");
const p2 = () => delay(50).then(() => "B");
const p3 = () => delay(80).then(() => {
  throw new Error("C failed");
});

// Promise.all — wait for all; fails fast on first reject
// Promise.all([p1(), p2()])
//   .then((results) => console.log("all:", results)) // ["A", "B"]
//   .catch((err) => console.error(err.message));

// Promise.all([p1(), p3()])
//   .then(console.log)
//   .catch((err) => console.error("all failed:", err.message));

// Promise.allSettled — wait for all; never rejects for item failures
// Promise.allSettled([p1(), p3()]).then((results) => {
//   console.log("allSettled:", results);
//   // [
//   //   { status: "fulfilled", value: "A" },
//   //   { status: "rejected", reason: Error }
//   // ]
// });

// Promise.race — first settled wins (fulfill OR reject)
// Promise.race([p1(), p2()])
//   .then((winner) => console.log("race winner:", winner)); // "B"

// Promise.any — first FULFILLED wins; rejects only if all reject
// Promise.any([p3(), p1()])
//   .then((firstOk) => console.log("any:", firstOk)) // "A"
//   .catch((err) => console.error(err)); // AggregateError if all fail


/*
  ============================================================
  OPTION 5 — ASYNC / AWAIT (syntax over promises)
  ============================================================

  async function always returns a Promise.
  await pauses THAT function until the promise settles
  (without blocking the whole thread).
*/

async function getUser(id) {
  try {
    const user = await fetchUserPromise(id);
    console.log("async/await user:", user);
    return user;
  } catch (err) {
    console.error("async/await error:", err.message);
    throw err; // rethrow if caller should handle it
  } finally {
    // console.log("cleanup");
  }
}

// getUser(1);
// getUser(-1);


/*
  Sequential vs parallel with async/await
*/

async function sequential() {
  const a = await p1(); // wait
  const b = await p2(); // then wait
  return [a, b];
}

async function parallel() {
  // start both immediately, then await
  const [a, b] = await Promise.all([p1(), p2()]);
  return [a, b];
}

// sequential().then((r) => console.log("sequential:", r));
// parallel().then((r) => console.log("parallel:", r));


/*
  Top-level await (ES modules only, not classic scripts):
    const user = await fetchUserPromise(1);
*/


/*
  ============================================================
  OPTION 6 — queueMicrotask / Promise microtasks
  ============================================================
*/

// console.log("sync start");
//
// queueMicrotask(() => console.log("microtask"));
//
// Promise.resolve().then(() => console.log("promise microtask"));
//
// setTimeout(() => console.log("macrotask"), 0);
//
// console.log("sync end");
//
// Order: sync start → sync end → microtask → promise microtask → macrotask


/*
  ============================================================
  OPTION 7 — EVENTS (DOM / EventTarget style)
  (browser; Node has EventEmitter)
  ============================================================
*/

// document.querySelector("button")?.addEventListener("click", (e) => {
//   console.log("clicked", e);
// });

// Custom EventTarget pattern:
class Emitter extends EventTarget {
  ping(detail) {
    this.dispatchEvent(new CustomEvent("ping", { detail }));
  }
}

// const em = new Emitter();
// em.addEventListener("ping", (e) => console.log("got ping:", e.detail));
// em.ping({ ok: true });


/*
  ============================================================
  OPTION 8 — fetch API (Promises + async/await)
  ============================================================
*/

async function loadTodos() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data;
}

// loadTodos()
//   .then((todo) => console.log("todo:", todo))
//   .catch((err) => console.error(err.message));


/*
  ============================================================
  OPTION 9 — AbortController (cancel async work)
  ============================================================
*/

async function loadWithTimeout(url, ms = 2000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// loadWithTimeout("https://jsonplaceholder.typicode.com/todos/1", 1000)
//   .then(console.log)
//   .catch((err) => console.error("aborted or failed:", err.name, err.message));


/*
  ============================================================
  OPTION 10 — CALLBACK → PROMISE (promisify)
  ============================================================
*/

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

const fetchUserAsync = promisify(fetchUserCallback);

// fetchUserAsync(1).then((u) => console.log("promisified:", u));


/*
  ============================================================
  OPTION 11 — ASYNC GENERATORS / for await...of
  ============================================================
*/

async function* asyncRange(max) {
  for (let i = 1; i <= max; i++) {
    await delay(50);
    yield i;
  }
}

async function consumeAsyncIterable() {
  for await (const n of asyncRange(3)) {
    console.log("async gen:", n);
  }
}

// consumeAsyncIterable();


/*
  ============================================================
  OPTION 12 — ERROR HANDLING PATTERNS
  ============================================================
*/

// A) then/catch
// fetchUserPromise(1).then(console.log).catch(console.error);

// B) async/await try/catch
async function safeGet(id) {
  try {
    return await fetchUserPromise(id);
  } catch (err) {
    return { error: err.message };
  }
}

// safeGet(-1).then(console.log);

// C) catch mid-chain and recover
// Promise.reject(new Error("x"))
//   .catch(() => "recovered")
//   .then((v) => console.log(v)); // "recovered"


/*
  ============================================================
  OPTION 13 — COMMON GOTCHAS
  ============================================================
*/

// 1) Forgetting await / returning the promise from async wrongly
async function gotchaForgetAwait() {
  const user = fetchUserPromise(1); // forgot await → Promise, not value
  // console.log(user); // Promise { <pending> }
}

// 2) setTimeout delay is MINIMUM delay, not exact
//    (runs after delay AND when stack/microtasks allow)

// 3) Creating promises in a loop without awaiting → fires in parallel
async function fireParallel() {
  const jobs = [1, 2, 3].map((id) => fetchUserPromise(id));
  const users = await Promise.all(jobs);
  return users;
}

// 4) Unhandled rejection (always attach catch or use try/catch)
// fetchUserPromise(-1); // bad: unhandledrejection in browsers/Node

// 5) async function errors become rejected promises
async function throwsAsync() {
  throw new Error("inside async");
}
// throwsAsync().catch((e) => console.error(e.message));


/*
  ============================================================
  MICROTASK vs MACROTASK — deeper demo
  ============================================================
*/

function eventLoopDeepDemo() {
  console.log("A");

  setTimeout(() => {
    console.log("B timeout");
    Promise.resolve().then(() => console.log("C promise inside timeout"));
  }, 0);

  Promise.resolve().then(() => {
    console.log("D promise");
    setTimeout(() => console.log("E timeout from promise"), 0);
  });

  console.log("F");

  // Expected:
  // A
  // F
  // D promise          (microtask)
  // B timeout          (macrotask)
  // C promise inside timeout  (microtasks after that macrotask)
  // E timeout from promise    (next macrotask)
}

// eventLoopDeepDemo();


/*
  ============================================================
  HOW ASYNC IS "IMPLEMENTED" (summary)
  ============================================================

  1. Your JS runs on one call stack (V8 / JS engine).
  2. Host environment (browser/Node) owns async APIs.
  3. When you call setTimeout/fetch/etc:
       - JS registers work with the host
       - continues running sync code
  4. When host finishes:
       - callback → macrotask queue
       - promise reaction → microtask queue
  5. Event loop:
       - never interrupts a running function
       - after stack clears: run ALL microtasks
       - then run next macrotask
  6. Promises / async-await are the modern API on top of this.
     async/await is syntactic sugar over promises + microtasks.

  Prefer today:
    - async/await + try/catch for readable flow
    - Promise.all / allSettled / race / any for concurrency
    - AbortController for cancellation
    - avoid raw callback pyramids unless required by old APIs
*/


/*
  Uncomment ONE demo at a time while learning, then run:
    node javascipt/asynchronous.js
*/
