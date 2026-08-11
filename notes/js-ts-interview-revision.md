# JS & TS Interview Revision Guide

Dense cheat sheet for tech interviews. Pair with practice files:
`javascipt/`, `typescript/`.

---

## Table of contents

1. JavaScript types  
2. TypeScript types  
3. Variables (`var` / `let` / `const`)  
4. Hoisting & TDZ  
5. Coercion & conversion  
6. Operators & syntax  
7. Types of functions  
8. `this`, `call`, `apply`, `bind`  
9. Closures  
10. Scope & lexical environment  
11. Execution context & call stack  
12. Arrays  
13. Objects & prototypes  
14. Classes & OOP  
15. Built-ins  
16. Iterators, generators, iterables  
17. Modules  
18. Programming paradigms  
19. Async / event loop / Promises  
20. Error handling  
21. Strict mode  
22. Strings, numbers, regex essentials  
23. DOM / browser events (front-end)  
24. Storage, HTTP, CORS (front-end/web)  
25. Design patterns & practical FP tools  
26. Memory, performance, copying  
27. JS vs TS differences  
28. Testing talking points  
29. Rapid-fire Qs  
30. Study path & mental models  

---

## 1. JavaScript types

### Primitive (immutable by value)
| Type | Examples | `typeof` |
|------|----------|----------|
| `undefined` | missing value | `"undefined"` |
| `null` | intentional empty | `"object"` ⚠️ bug/legacy |
| `boolean` | `true` / `false` | `"boolean"` |
| `number` | `1`, `3.14`, `NaN`, `Infinity` | `"number"` |
| `bigint` | `10n` | `"bigint"` |
| `string` | `"hi"`, `` `hi` `` | `"string"` |
| `symbol` | `Symbol("id")` | `"symbol"` |

### Non-primitive (reference)
- **Object** — plain objects, arrays, functions, dates, maps, sets, regex, errors…
- `typeof []` → `"object"`, `typeof function(){}` → `"function"`
- Check arrays: `Array.isArray(x)`
- Check null safely: `x === null`

### Special number values
- `NaN` — `NaN === NaN` is **false**; use `Number.isNaN(x)`
- `Infinity` / `-Infinity`
- `-0` exists; prefer `Object.is(a, b)` for SameValue

### Pass-by
- Primitives → **value**
- Objects/arrays/functions → **reference** (shared identity)

---

## 2. TypeScript types

### Same runtime as JS
Types are **erased** at compile time.

### Special TS types
| Type | Meaning |
|------|---------|
| `any` | opt out (avoid) |
| `unknown` | safe top — must narrow |
| `never` | unreachable / always throws |
| `void` | nothing useful returned |
| `object` | non-primitive (rarely useful alone) |

### Structural typing
```ts
type Point = { x: number; y: number };
const p = { x: 1, y: 2, z: 3 };
const q: Point = p; // OK
```

### Unions / intersections / literals / generics
```ts
type Id = string | number;
type Admin = User & { role: "admin" };
type Dir = "up" | "down";
function identity<T>(v: T): T { return v; }
```

### Narrowing
`typeof`, `instanceof`, `in`, equality, discriminated unions, type guards, `asserts`.

### `interface` vs `type`
- `interface` — object shapes, declaration merging
- `type` — unions, mapped/conditional, tuples

### Utility types
`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`

Prefer **string unions** over numeric `enum` unless you need reverse mapping.

---

## 3. Variables: `var` / `let` / `const`

| | `var` | `let` | `const` |
|--|-------|-------|---------|
| Scope | function | block | block |
| Redeclare | yes | no | no |
| Reassign | yes | yes | no (binding) |
| Hoisting | → `undefined` | TDZ | TDZ |
| Modern use | avoid | when reassigning | default |

```js
const user = { name: "A" };
user.name = "B"; // OK mutate
// user = {};    // TypeError rebind
```

---

## 4. Hoisting & TDZ

- **Function declarations** — fully hoisted, callable above
- **`var`** — declared as `undefined` until assignment
- **`let` / `const` / `class`** — TDZ until init → `ReferenceError`
- **Function expressions / arrows** — follow their `var`/`let`/`const` binding

See: `javascipt/hoisting.js`, `typescript/hoisting.ts`

---

## 5. Coercion & conversion

### Explicit (prefer)
```js
Number("42"); String(42); Boolean(1);
parseInt("08", 10); // always pass radix
```

### Implicit traps
| Expression | Result |
|------------|--------|
| `1 + "2"` | `"12"` |
| `"2" - 1` | `1` |
| `[] + []` | `""` |
| `null + 1` | `1` |
| `undefined + 1` | `NaN` |
| `!!x` | boolean |

### Falsy
`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`  
Truthy includes `[]`, `{}`, `"0"`.

### Equality
- `==` coerce (avoid)
- `===` strict (prefer)
- `Object.is` SameValue (`NaN`, `-0`)

`null == undefined` → true; `null === undefined` → false.

---

## 6. Operators & syntax essentials

```js
const [a, b = 0] = [1];
const { name, age: years = 18 } = person;
const copy = { ...obj };
const merged = [...a, ...b];
function sum(...nums) {}
user?.profile?.city
value ?? "default"   // only null/undefined
x ??= 1; x ||= 1; x &&= 1;
```

`&&` / `||` return operands (not always boolean).

---

## 7. Types of functions (interview checklist)

JS functions are **first-class** (store, pass, return) and **higher-order** capable (take/return functions).

### By syntax / creation

| Kind | Example | Notes |
|------|---------|-------|
| Declaration | `function foo() {}` | Hoisted |
| Expression | `const f = function() {}` | Not hoisted like decl; can be named for stack traces |
| Arrow | `const f = () => {}` | Lexical `this`; no `arguments`, `new`, `prototype` |
| Method | `obj = { m() {} }` | `this` = receiver when called as method |
| Constructor | `function User() {}` / `class` | Called with `new` |
| Generator | `function* gen() { yield 1 }` | Pause/resume iterator |
| Async | `async function f() {}` | Always returns `Promise` |
| Async generator | `async function* g() {}` | `for await...of` |
| IIFE | `(function(){ ... })()` | Immediate run; old module/privacy pattern |
| Callback | `arr.map(x => x * 2)` | Passed to be called later |
| Recursive | `function fact(n){ ... fact(n-1) }` | Calls itself; need base case |
| Pure | `add(a,b)=>a+b` | No side effects; same in → same out |
| Impure | reads/writes outer state, I/O, `Date.now()` | Harder to test |
| Anonymous | no name | arrows / unnamed expressions |
| Named | `function foo` / `const f = function foo` | Better debugging |

### By role / pattern

| Kind | Meaning |
|------|---------|
| Higher-order (HOF) | Takes or returns a function (`map`, `filter`, decorators) |
| Closure factory | Returns inner function that closes over state |
| Partial / curried | Pre-fill args; see §25 |
| Predicate | Returns boolean (`x => x > 0`) |
| Reducer | `(acc, item) => nextAcc` for `reduce` |
| Comparator | `(a,b) => number` for `sort` |
| Getter / setter | `get x()` / `set x(v)` |
| Middleware | `(req,res,next) => ...` style chain |

### Arrow vs regular (must recite)

| | Regular | Arrow |
|--|---------|-------|
| `this` | dynamic (call site) | lexical (outer) |
| `arguments` | yes | no (use rest) |
| `new` | yes | no |
| `prototype` | yes | no |
| As object method | OK | usually wrong |
| As callback needing `this` | careful | often better |

```js
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++; // arrow keeps timer as this
    }, 1000);
  },
};
```

### Default / rest / `arguments`
```js
function greet(name = "Guest", ...tags) {}
// undefined triggers default; null does NOT
function old() {
  console.log(arguments); // array-like; not in arrows
}
```

### Return values
- No `return` → `undefined`
- `async` → always `Promise`
- Constructor with `new` → object (`this`) unless explicitly returns another object

---

## 8. `this`, `call`, `apply`, `bind`

### How `this` is decided (priority mental model)

1. **`new`** → new instance  
2. **Explicit** → `call` / `apply` / `bind`  
3. **Method call** → object before the dot  
4. **Bare call** → `undefined` (strict) / global (`window`/`global`) in sloppy  
5. **Arrow** → ignores 1–4 for its own `this`; uses lexical outer `this`

Losing `this` classic bug:
```js
const user = {
  name: "Ada",
  hi() { console.log(this.name); },
};
const f = user.hi;
f();              // undefined / global — not user
setTimeout(user.hi, 0); // same problem
```

### `call`
Invoke **now**, set `this`, args **list**:
```js
function greet(greeting, punct) {
  console.log(greeting + ", " + this.name + punct);
}
const person = { name: "Sam" };
greet.call(person, "Hello", "!"); // Hello, Sam!
```

### `apply`
Same as `call`, but args as **array** (or array-like):
```js
greet.apply(person, ["Hi", "?"]); // Hi, Sam?
Math.max.apply(null, [1, 5, 3]);  // old style; today Math.max(...arr)
```

### `bind`
Returns a **new function** with fixed `this` (and optional preset args). Does **not** call immediately:
```js
const hiSam = greet.bind(person, "Hey");
hiSam("!!"); // Hey, Sam!!

const bound = user.hi.bind(user);
setTimeout(bound, 0); // works
```

Partial application with bind:
```js
function mul(a, b) { return a * b; }
const double = mul.bind(null, 2);
double(5); // 10
```

### Comparison table

| | Calls immediately? | `this` | Extra args |
|--|--------------------|--------|------------|
| `call` | yes | 1st arg | comma-separated |
| `apply` | yes | 1st arg | single array |
| `bind` | no (returns fn) | 1st arg | preset then later |

### Hard bind / re-bind
```js
const f = greet.bind(person);
f.call({ name: "Other" }, "Yo", "."); // still person — bind wins for this
```

### Soft patterns today
- Prefer arrow for lexical `this` in callbacks
- Prefer `bind` when passing methods as callbacks
- Prefer rest/spread over `apply` for arg arrays

### TS note
`this` parameter annotation:
```ts
function greet(this: { name: string }, msg: string) {
  console.log(this.name, msg);
}
```

---

## 9. Closures

### Definition (interview answer)
A **closure** is a function bundled with its **lexical environment** — it remembers outer variables even after the outer function has returned.

```js
function makeCounter() {
  let count = 0;          // private state
  return function () {    // closure
    count += 1;
    return count;
  };
}
const c1 = makeCounter();
const c2 = makeCounter();
c1(); // 1
c1(); // 2
c2(); // 1  — separate closed-over state
```

### Why useful
- Data privacy / encapsulation (module pattern)
- Function factories
- Partial application / currying
- Event handlers & callbacks that need outer values
- Memoization caches
- React hooks mental model (functions close over render scope — careful with stale closures)

### Classic loop gotcha
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3,3,3 — one shared var i
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // 0,1,2 — new binding each iter
}
```

### Module pattern (pre-ESM)
```js
const api = (function () {
  let secret = 42;
  return {
    get() { return secret; },
    set(v) { secret = v; },
  };
})();
```

### Memory note
Closures keep referenced outer vars alive → can cause leaks if they retain large objects/DOM nodes unintentionally.

### Closure vs scope
- **Scope** — set of rules for variable visibility
- **Closure** — the combination of function + retained outer scope at creation time

---

## 10. Scope & lexical environment

- Chain: **global** → **function** → **block** (`let`/`const`)
- **Lexical** = based on where code is **written**, not where called
- Free variables resolved by walking the scope chain
- Shadowing: inner name hides outer
- `var` ignores block scope (except weird function-scoped edge cases)

---

## 11. Execution context & call stack

Each function call creates an **execution context**:
- Lexical environment (variables, outer ref)
- `this` binding
- (for functions) argument list

**Call stack:** LIFO of contexts. Overflow → `RangeError: Maximum call stack size exceeded` (infinite recursion).

Creation vs execution phase (classic interview wording for hoisting):
1. **Creation** — bind declarations (`var`→undefined, functions, TDZ for let/const)
2. **Execution** — run code line by line

---

## 12. Arrays

```js
[1, 2, 3]
Array.from("ab")
Array.of(2)
```

**Mutating:** `push` `pop` `shift` `unshift` `splice` `sort` `reverse` `fill` `copyWithin`  
**Non-mutating:** `map` `filter` `slice` `concat` `toSorted` `toReversed` `toSpliced` `with` spread

Also: `find` `findIndex` `includes` `some` `every` `reduce` `flat` `flatMap` `at(-1)`

Prefer dense arrays; avoid sparse `Array(n)` unless intentional.

---

## 13. Objects & prototypes

```js
const o = { a: 1, b() {}, [key]: 2 };
Object.create(proto)
Object.assign(t, s)
{ ...s }
```

- Property lookup walks `[[Prototype]]`
- `class` = sugar over prototypes
- Own vs inherited: `Object.hasOwn(obj, key)` (prefer)
- `for...in` enumerates enumerable inherited keys — careful
- `Object.keys/values/entries`, `freeze/seal` (shallow)

Property descriptors: `writable`, `enumerable`, `configurable`, getters/setters.

### Prototype interview lines
```js
function Person(name) { this.name = name; }
Person.prototype.hi = function () { return "hi " + this.name; };
const p = new Person("A");
p.hi();
Object.getPrototypeOf(p) === Person.prototype; // true
p.__proto__; // legacy accessor — prefer getPrototypeOf
```

---

## 14. Classes & OOP

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() {}
  static isAnimal(x) { return x instanceof Animal; }
}
class Dog extends Animal {
  #chip; // private field
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}
```

- Class decl in TDZ (not like `function`)
- `super()` before `this` in subclass
- Prefer **composition over inheritance**
- TS: `public`/`private`/`protected`, `readonly`, `abstract`, `implements`, parameter properties

OOP pillars in JS terms: encapsulation (closures/`#`), inheritance (`extends`/proto), polymorphism (same method name, different behavior).

---

## 15. Built-ins to revise

**Core:** Object Function Array String Number Boolean Symbol BigInt Error(+subtypes)  
**Collections:** Map Set WeakMap WeakSet  
**Async/host:** Promise fetch AbortController timers  
**Meta:** Proxy Reflect JSON Math Date RegExp Intl URL  

Map vs object: any key type, size, insertion order, no prototype key collisions.  
Set: uniqueness / dedupe (`[...new Set(arr)]`).  
Weak*: GC-friendly object keys; not iterable.

---

## 16. Iterators, generators, iterables

- **Iterable:** has `[Symbol.iterator]()` → iterator  
- **Iterator:** `next()` → `{ value, done }`  
- `for...of` consumes iterables; `for...in` enumerates keys (different!)

```js
function* idMaker() {
  let id = 1;
  while (true) yield id++;
}
const ids = idMaker();
ids.next().value; // 1
```

Generators: lazy sequences, custom iterables, cooperative pause (`yield`).

---

## 17. Modules

### ESM
```js
export const PI = 3.14;
export default function mul(a, b) { return a * b; }
import mul, { PI } from "./math.js";
import * as math from "./math.js";
const mod = await import("./lazy.js"); // dynamic
```

Strict, static, live bindings, top-level await (modules).

### CJS
```js
module.exports = { add };
const { add } = require("./math");
```

| | ESM | CJS |
|--|-----|-----|
| Load | static + `import()` | `require` |
| Tree-shake | good | hard |
| Browser | native | no |

---

## 18. Programming paradigms

| Paradigm | Idea in JS/TS |
|----------|----------------|
| Imperative | Statements mutate state step by step |
| Declarative | Describe what (`map`, React JSX) |
| OOP | Objects, prototypes/classes, composition |
| Functional | Pure fns, immutability, HOF, compose |
| Event-driven | Listeners, emitters, callbacks/promises |
| Reactive | Values over time (streams, UI state) |

JS/TS are **multi-paradigm** — say that in interviews.

---

## 19. Async / event loop / Promises

### Event loop
1. Run call stack  
2. Drain **all microtasks** (Promises, `queueMicrotask`)  
3. Run **one macrotask** (timeout, I/O, UI)  
4. Repeat  

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1 4 3 2
```

### Promise states
`pending` → `fulfilled` | `rejected` (settled; one-way)

### Combinators
- `Promise.all` — fail fast  
- `Promise.allSettled` — wait all  
- `Promise.race` — first settle  
- `Promise.any` — first fulfill (`AggregateError` if all fail)

### async/await
Syntax over promises; `try/catch` for errors; parallelize with `Promise.all`.

See: `javascipt/asynchronous.js`, `typescript/asynchronous.ts`

---

## 20. Error handling

```js
try { throw new TypeError("bad"); }
catch (err) {
  if (err instanceof TypeError) { /* */ }
  else throw err;
} finally { /* cleanup */ }
```

Types: Error TypeError ReferenceError SyntaxError RangeError URIError AggregateError  
Async: await + try/catch or `.catch`  
Wrap: `new Error("ctx", { cause: err })`

See: `javascipt/errorHandling.js`, `typescript/errorHandling.ts`

---

## 21. Strict mode

`"use strict";` (modules are strict by default)

Effects (high-signal):
- Undeclared assignment → error
- `this` in bare call → `undefined` (not global)
- Cannot assign to read-only / duplicate params (legacy)
- `with` forbidden
- Quieter footguns overall

---

## 22. Strings, numbers, regex essentials

### Strings
Immutable; methods return new strings.  
`slice` `substring` `split` `trim` `includes` `startsWith` `endsWith` `padStart` `replace` `replaceAll` `repeat`  
Template literals: `` `Hi ${name}` ``

### Numbers
IEEE-754 floats → `0.1 + 0.2 !== 0.3`  
`Number.isFinite` `Number.isInteger` `Number.isSafeInteger`  
`Math.floor/ceil/round/trunc` `Math.random` (not crypto)  
BigInt for large integers (`10n`) — don’t mix with Number without convert

### Regex
```js
/^\d+$/.test("42")
"a1b".match(/\d/)
"a1b".replace(/\d/, "X")
```
Flags: `g i m s u y`  
Prefer readable code over cryptic regex in interviews unless asked.

---

## 23. DOM / browser events (front-end interviews)

### Event flow
1. **Capture** (top → target)  
2. **Target**  
3. **Bubble** (target → top)

```js
el.addEventListener("click", handler, { capture: false, once: true, passive: true });
el.removeEventListener("click", handler);
```

### Delegation
Listen on parent; use `event.target` / `closest` — efficient for lists.

### `preventDefault` vs `stopPropagation`
- `preventDefault` — stop browser default (link navigate, submit)
- `stopPropagation` — stop bubbling/capturing further

### `event.target` vs `event.currentTarget`
- `target` — originating element  
- `currentTarget` — element with the listener

---

## 24. Storage, HTTP, CORS (web)

| Storage | Lifetime | Size (approx) | Sent to server |
|---------|----------|---------------|----------------|
| `localStorage` | until cleared | ~5MB | no |
| `sessionStorage` | tab session | ~5MB | no |
| cookies | configurable | ~4KB | yes (unless HttpOnly/etc.) |

Only store non-sensitive data in web storage; tokens → careful (prefer httpOnly cookies for session).

### HTTP talking points
Methods: GET POST PUT PATCH DELETE  
Status: 2xx success, 3xx redirect, 4xx client, 5xx server  
Idempotent: GET PUT DELETE (usually); POST not  

### CORS
Browser blocks cross-origin responses unless server sends proper `Access-Control-*` headers.  
Simple vs preflight (`OPTIONS`). Front-end cannot “fix” CORS — server must allow.

---

## 25. Design patterns & practical FP tools

### Common JS patterns
| Pattern | Idea |
|---------|------|
| Module | Hide private state; export public API |
| Singleton | One shared instance (careful / often overused) |
| Factory | Function creates objects |
| Observer / PubSub | Subscribe to events |
| Middleware | Chain of handlers (`next`) |
| Decorator | Wrap function/class to add behavior |
| Adapter | Translate one interface to another |
| Strategy | Swap algorithms behind same API |
| Revealing module | IIFE returning public methods |

### Currying
Transform `f(a,b,c)` into `f(a)(b)(c)`:
```js
const add = (a) => (b) => a + b;
add(1)(2); // 3
```

### Partial application
Pre-fill some args (often via `bind` or closures):
```js
const mul = (a, b) => a * b;
const triple = (n) => mul(3, n);
```

### Compose / pipe
```js
const compose = (f, g) => (x) => f(g(x));
const pipe = (f, g) => (x) => g(f(x));
```

### Debounce vs throttle
- **Debounce:** wait until quiet (search input)
- **Throttle:** at most once per interval (scroll)

### Memoization
Cache results of pure fn by args (closures + Map).

---

## 26. Memory, performance, copying

- GC mark-and-sweep; watch retained closures / detached DOM / unbounded caches
- **Shallow copy:** `{...o}`, `[...a]` — nested refs shared  
- **Deep copy:** `structuredClone(o)` (or libs); `JSON.parse(JSON.stringify(o))` loses types/functions/`undefined`
- Debounce/throttle hot handlers
- Know Big-O roughly: most array iteration O(n); careful nested loops O(n²)

---

## 27. JS vs TS — differences

| Topic | JavaScript | TypeScript |
|-------|------------|------------|
| Types | dynamic runtime | static, erased |
| Errors | mostly runtime | many at compile |
| `catch (e)` | any value | prefer `unknown` |
| OOP extras | proto/class | interfaces, modifiers, abstract |
| Generics | no | yes |
| Enums | unions/objects | `enum` or unions |
| Runtime checks | manual | still manual (zod etc.) |

TS does **not** change the event loop or add runtime types by itself.

---

## 28. Testing talking points

Unit → integration → E2E; mocks vs stubs vs fakes; pure functions easy to unit test.  
See `notes/tests.md`.

---

## 29. Rapid-fire interview Qs

1. `==` vs `===`?  
2. `null` vs `undefined`?  
3. What is a **closure**? Give an example.  
4. What is **hoisting** / **TDZ**?  
5. Event loop: microtask vs macrotask?  
6. Arrow vs regular function (`this`)?  
7. `call` vs `apply` vs `bind`?  
8. Types of functions you know?  
9. Shallow vs deep copy?  
10. `map` vs `forEach` vs `reduce`?  
11. Promise states + `all` vs `allSettled` vs `race` vs `any`?  
12. What does `async` return?  
13. ESM vs CJS?  
14. Pure function?  
15. Prototype vs `class`?  
16. `any` vs `unknown`?  
17. Structural vs nominal typing?  
18. `interface` vs `type`?  
19. Falsy values list?  
20. Why `typeof null === "object"`?  
21. Debounce vs throttle?  
22. Event bubbling vs capturing? Delegation?  
23. How does `this` get set?  
24. What is an IIFE? Why use one historically?  
25. Currying vs partial application?  
26. `let` in `for` vs `var` in `for` with async callbacks?  
27. How do you make private state in JS? (`#`, closures)  
28. What is a higher-order function?  
29. CORS in one sentence?  
30. Does TypeScript exist at runtime?

---

## 30. Study path (your repo)

| Topic | File |
|-------|------|
| Async / event loop | `javascipt/asynchronous.js`, `typescript/asynchronous.ts` |
| ES6+ | `javascipt/es6.js`, `typescript/es6.ts` |
| Hoisting / TDZ | `javascipt/hoisting.js`, `typescript/hoisting.ts` |
| Errors | `javascipt/errorHandling.js`, `typescript/errorHandling.ts` |
| Functions | `javascipt/functions.js`, `typescript/functions.ts` |
| Tests | `notes/tests.md` |
| This guide | `notes/js-ts-interview-revision.md` |

**Method:** read → explain aloud → uncomment demo → predict output → run.

### One-page mental models
1. Values: primitive copy vs reference share  
2. Scope: lexical + TDZ  
3. `this`: new → bind/call/apply → method → default; arrows lexical  
4. Closures: function + remembered env  
5. Async: stack > microtasks > macrotasks  
6. OOP: prototype links; class is sugar  
7. FP: pure transforms + immutability + HOF  
8. TS: contracts at compile time; validate IO at runtime  
