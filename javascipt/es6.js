/*
  ============================================================
  ES6 (ECMAScript 2015) — WHAT CHANGED
  ============================================================

  ES6 is the big language upgrade that modern JS is built on.
  Before ES6: var, function, prototypes, callbacks-heavy style.
  After ES6:  block scope, classes, modules, promises, nicer syntax.

  Goal of this file:
    understand each major feature with a small mental model
    + short demos you can uncomment and run.
*/


/*
  ============================================================
  1) let & const  (block-scoped variables)
  ============================================================

  Problem with var:
    - function-scoped (not block-scoped)
    - can be redeclared
    - is hoisted and initialized as undefined (leaks)

  let / const:
    - block-scoped { ... }
    - NOT redeclared in same scope
    - hoisted but in Temporal Dead Zone (TDZ) until the line runs
    - const = binding cannot be reassigned (object contents can still mutate)

  Rule of thumb:
    prefer const by default
    use let when you must reassign
    avoid var in modern code
*/

// --- var leak into outer scope ---
// if (true) {
//   var leaked = "I escape the block";
// }
// console.log(leaked); // "I escape the block"

// --- let / const stay in the block ---
// if (true) {
//   let a = 1;
//   const b = 2;
// }
// console.log(a); // ReferenceError
// console.log(b); // ReferenceError

// --- TDZ (Temporal Dead Zone) ---
// console.log(x); // ReferenceError (not undefined like var)
// let x = 10;

// --- const reassignment vs mutation ---
// const user = { name: "Anna" };
// user.name = "Bob";     // OK — mutating object contents
// // user = {};          // TypeError — rebinding not allowed

// --- classic loop trap with var ---
// for (var i = 0; i < 3; i++) {
//   setTimeout(() => console.log("var i:", i), 0);
// }
// // prints: 3, 3, 3  (one shared i)

// for (let j = 0; j < 3; j++) {
//   setTimeout(() => console.log("let j:", j), 0);
// }
// // prints: 0, 1, 2  (new j each iteration)


/*
  ============================================================
  2) Arrow functions
  ============================================================

  Syntax sugar + important behavior difference:
    - shorter syntax
    - NO own `this`, `arguments`, `super`, or `new.target`
    - `this` is lexically captured from surrounding scope
    - cannot be used as constructors (new Arrow() fails)
    - no prototype property

  Use when:
    callbacks, array methods, short pure helpers
  Avoid when:
    you need a method that relies on dynamic `this`,
    or a constructor / prototype method pattern.
*/

// const add = (a, b) => a + b;
// const square = (n) => n * n;
// const makeUser = (name) => ({ name }); // paren needed to return object literal

// --- lexical this ---
// const timer = {
//   seconds: 0,
//   start() {
//     // regular method: this = timer
//     setInterval(() => {
//       // arrow inherits this from start()
//       this.seconds += 1;
//       console.log(this.seconds);
//     }, 1000);
//   },
// };
// // timer.start();

// --- wrong: arrow as object method (this is NOT the object) ---
// const bad = {
//   name: "Kit",
//   greet: () => console.log("Hi", this.name), // this ≠ bad
// };
// // bad.greet();


/*
  ============================================================
  3) Template literals
  ============================================================

  Backticks `...` give you:
    - string interpolation: ${expression}
    - multi-line strings without \n hacks
    - tagged templates (advanced formatting / DSLs)
*/

// const name = "Ada";
// const score = 95;
// console.log(`Player ${name} scored ${score}%`);
//
// const html = `
// <section>
//   <h1>${name}</h1>
// </section>
// `;
// console.log(html);

// --- tagged template (receives raw parts + values) ---
// function highlight(strings, ...values) {
//   return strings.reduce((out, str, i) => {
//     const value = values[i] !== undefined ? `[${values[i]}]` : "";
//     return out + str + value;
//   }, "");
// }
// const lang = "JS";
// console.log(highlight`I love ${lang} and ES6`);
// // I love [JS] and ES6


/*
  ============================================================
  4) Default parameters
  ============================================================

  Function params can have defaults.
  Defaults are evaluated at call time (left → right).
  Missing / undefined triggers the default (null does NOT).
*/

// function greet(user = "Guest", times = 1) {
//   for (let i = 0; i < times; i++) console.log(`Hello, ${user}`);
// }
// greet();            // Guest once
// greet("Sam", 2);    // Sam twice
// greet(undefined, 3);// Guest three times
// greet(null);        // Hello, null  (null is an explicit value)

// --- default can use earlier params ---
// function createUrl(path, base = "https://api.test", full = `${base}${path}`) {
//   return full;
// }
// console.log(createUrl("/users"));


/*
  ============================================================
  5) Rest & Spread
  ============================================================

  Rest  (...left)  → gather remaining items INTO an array/object
  Spread (...right)→ expand an array/object OUT into places

  Same dots, opposite direction of data flow.
*/

// --- rest in functions (always last param) ---
// function sum(first, ...rest) {
//   return rest.reduce((total, n) => total + n, first);
// }
// console.log(sum(1, 2, 3, 4)); // 10

// --- spread arrays ---
// const a = [1, 2];
// const b = [3, 4];
// const merged = [...a, ...b, 5];
// console.log(merged); // [1, 2, 3, 4, 5]
//
// const copy = [...a]; // shallow copy

// --- spread objects (shallow merge/copy) ---
// const defaults = { theme: "dark", lang: "en" };
// const settings = { ...defaults, lang: "uk" };
// console.log(settings); // { theme: "dark", lang: "uk" }

// --- rest in destructuring ---
// const [head, ...tail] = [10, 20, 30, 40];
// console.log(head, tail); // 10 [20, 30, 40]
//
// const { id, ...profile } = { id: 1, name: "Lia", role: "dev" };
// console.log(id, profile); // 1 { name: "Lia", role: "dev" }


/*
  ============================================================
  6) Destructuring
  ============================================================

  Unpack values from arrays/objects into variables
  in one expression. Extremely common in modern JS APIs.
*/

// --- array destructuring ---
// const rgb = [255, 100, 50];
// const [r, g, b] = rgb;
// console.log(r, g, b);
//
// const [first, , third] = ["a", "b", "c"]; // skip items
// const [x = 0, y = 0] = [5];               // defaults
// console.log(first, third, x, y);

// --- object destructuring ---
// const person = { name: "Omar", age: 30, city: "Kyiv" };
// const { name, age } = person;
// const { city: hometown } = person; // rename
// const { country = "UA" } = person; // default
// console.log(name, age, hometown, country);

// --- nested + function params ---
// function printUser({ name, address: { city } }) {
//   console.log(`${name} lives in ${city}`);
// }
// printUser({ name: "Nina", address: { city: "Lviv", zip: "79000" } });

// --- swap variables without temp ---
// let p = 1, q = 2;
// [p, q] = [q, p];
// console.log(p, q); // 2, 1


/*
  ============================================================
  7) Enhanced object literals
  ============================================================

  Shorthand for properties, methods, and computed keys.
*/

// const title = "Notebook";
// const pages = 120;
// const key = "color";
//
// const book = {
//   title,                 // same as title: title
//   pages,
//   [key]: "blue",         // computed property name
//   read() {               // method shorthand
//     console.log(`Reading ${this.title}`);
//   },
// };
// book.read();
// console.log(book);


/*
  ============================================================
  8) Classes (syntactic sugar over prototypes)
  ============================================================

  class syntax does NOT invent a new OO model.
  Under the hood it still uses prototypes.
  Benefits: clearer inheritance, constructors, methods, statics.

  Notes:
    - class declarations are NOT hoisted like function declarations
    - methods are non-enumerable
    - must call super() before using this in a subclass constructor
*/

// class Animal {
//   constructor(name) {
//     this.name = name;
//   }
//
//   speak() {
//     console.log(`${this.name} makes a sound`);
//   }
//
//   static isAnimal(value) {
//     return value instanceof Animal;
//   }
// }
//
// class Dog extends Animal {
//   constructor(name, breed) {
//     super(name); // required before this
//     this.breed = breed;
//   }
//
//   speak() {
//     console.log(`${this.name} barks`);
//   }
// }
//
// const rex = new Dog("Rex", "Husky");
// rex.speak();
// console.log(Dog.isAnimal(rex)); // true (static inherited)
// console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true


/*
  ============================================================
  9) Modules (import / export)
  ============================================================

  ES modules let you split code into files with explicit APIs.

  export:
    - named exports: many per file
    - default export: one main value per file

  import:
    - static (analyzed at load time)
    - module code runs in strict mode
    - each module has its own top-level scope
    - imports are live read-only views (for bindings)

  In browsers: <script type="module">
  In Node: "type": "module" in package.json (or .mjs)

  Example shape (separate files):

    // math.js
    export const PI = 3.14;
    export function add(a, b) { return a + b; }
    export default function multiply(a, b) { return a * b; }

    // app.js
    import multiply, { PI, add as sum } from "./math.js";
    import * as math from "./math.js";
*/


/*
  ============================================================
  10) Promises (foundation of modern async)
  ============================================================

  A Promise represents a future value:
    pending → fulfilled (value)
             → rejected  (reason)

  Why they matter:
    - replace deeply nested callbacks ("callback hell")
    - chainable .then/.catch/.finally
    - compose with Promise.all / race / allSettled / any
    - async/await (ES2017) is sugar over promises

  Mental model:
    executor runs now
    handlers (.then) run later as microtasks
*/

// const wait = (ms) =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve(`waited ${ms}ms`), ms);
//   });
//
// wait(300)
//   .then((msg) => {
//     console.log(msg);
//     return wait(200);
//   })
//   .then((msg) => console.log(msg))
//   .catch((err) => console.error("failed:", err))
//   .finally(() => console.log("done"));

// --- combinators ---
// Promise.all([wait(100), wait(200)])
//   .then((results) => console.log("all:", results));
// // fails fast if any reject
//
// Promise.allSettled([wait(100), Promise.reject("nope")])
//   .then((results) => console.log("allSettled:", results));
// // always waits for all; each item is {status, value|reason}
//
// Promise.race([wait(500), wait(100)])
//   .then((winner) => console.log("race:", winner));


/*
  ============================================================
  11) Symbols
  ============================================================

  Symbol() creates a unique, immutable primitive value.
  Main uses:
    - unique object keys that won't accidentally collide
    - protocol hooks (Symbol.iterator, Symbol.toStringTag, ...)

  Every Symbol() call is unique, even with same description.
  Symbol.for("id") shares a global registry key.
*/

// const a = Symbol("id");
// const b = Symbol("id");
// console.log(a === b); // false
//
// const user = {
//   name: "Eve",
//   [a]: 123,
// };
// console.log(user[a]);          // 123
// console.log(Object.keys(user)); // ["name"] — symbol keys hidden from normal keys
// console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]


/*
  ============================================================
  12) Iterators & for...of
  ============================================================

  Iterable protocol:
    object has [Symbol.iterator]() → returns an iterator

  Iterator protocol:
    object has next() → { value, done }

  for...of consumes iterables (arrays, strings, maps, sets, etc.)
  for...in enumerates keys (different purpose — usually avoid for arrays)
*/

// const colors = ["red", "green", "blue"];
// for (const color of colors) {
//   console.log(color);
// }
//
// for (const ch of "ES6") {
//   console.log(ch);
// }

// --- custom iterable ---
// const range = {
//   from: 1,
//   to: 3,
//   [Symbol.iterator]() {
//     let current = this.from;
//     const last = this.to;
//     return {
//       next() {
//         if (current <= last) {
//           return { value: current++, done: false };
//         }
//         return { value: undefined, done: true };
//       },
//     };
//   },
// };
//
// for (const n of range) console.log(n); // 1, 2, 3
// console.log([...range]); // [1, 2, 3]


/*
  ============================================================
  13) Generators
  ============================================================

  function* creates a generator function.
  Calling it returns a generator object (iterator + controller).

  yield pauses function and returns a value.
  next() resumes until the next yield / return.

  Great for:
    lazy sequences, custom iterables, async flows (historical),
    puling values on demand.
*/

// function* idMaker() {
//   let id = 1;
//   while (true) {
//     yield id++;
//   }
// }
//
// const ids = idMaker();
// console.log(ids.next().value); // 1
// console.log(ids.next().value); // 2
// console.log(ids.next().value); // 3

// function* rangeGen(from, to) {
//   for (let i = from; i <= to; i++) yield i;
// }
// console.log([...rangeGen(2, 5)]); // [2, 3, 4, 5]


/*
  ============================================================
  14) Map & Set (and WeakMap / WeakSet)
  ============================================================

  Map:
    - key → value store
    - keys can be ANY type (objects, functions, ...)
    - remembers insertion order
    - .size, .get/.set/.has/.delete/.clear

  Set:
    - unique values collection
    - useful for dedupe / membership checks

  WeakMap / WeakSet:
    - keys/values are weakly held objects
    - not iterable, no .size
    - allow GC when nothing else references the object
    - good for private metadata / caches tied to object lifetime
*/

// const map = new Map();
// const objKey = { id: 1 };
// map.set(objKey, "meta");
// map.set("role", "admin");
// console.log(map.get(objKey)); // "meta"
// console.log(map.size);        // 2
//
// for (const [key, value] of map) {
//   console.log(key, value);
// }

// const set = new Set([1, 2, 2, 3, 3, 3]);
// set.add(4);
// console.log(set);            // Set(4) {1, 2, 3, 4}
// console.log([...set]);       // [1, 2, 3, 4]
// console.log(set.has(2));     // true

// --- dedupe array ---
// const unique = [...new Set(["a", "b", "a", "c", "b"])];
// console.log(unique); // ["a", "b", "c"]


/*
  ============================================================
  15) New array helper methods (ES6 era essentials)
  ============================================================

  Array.from     — array-like / iterable → real array
  Array.of       — create array from args (fixes Array(2) trap)
  find / findIndex
  includes (ES2016, but always mentioned with modern arrays)
  fill / copyWithin
*/

// console.log(Array.from("hey"));              // ["h", "e", "y"]
// console.log(Array.from({ length: 3 }, (_, i) => i + 1)); // [1, 2, 3]
// console.log(Array.of(2));                    // [2]  (not empty length-2 array)
//
// const nums = [5, 12, 8, 130, 44];
// console.log(nums.find((n) => n > 10));       // 12
// console.log(nums.findIndex((n) => n > 10));  // 1


/*
  ============================================================
  16) String helpers
  ============================================================

  startsWith / endsWith / includes
  repeat
  (later years added padStart/padEnd, replaceAll, etc.)
*/

// const file = "report.pdf";
// console.log(file.startsWith("report")); // true
// console.log(file.endsWith(".pdf"));     // true
// console.log(file.includes("port"));     // true
// console.log("ha".repeat(3));            // hahaha


/*
  ============================================================
  17) Number & Math additions
  ============================================================

  Number.isNaN / Number.isFinite  — no silent coercion traps
  Number.isInteger
  Number.parseInt / Number.parseFloat (same as globals, namespaced)
  Number.EPSILON, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER
  Math.sign, Math.trunc, Math.hypot, Math.cbrt, ...
*/

// console.log(Number.isNaN("NaN")); // false  (string is not NaN)
// console.log(isNaN("NaN"));        // true   (coerces first)
//
// console.log(Number.isFinite("10")); // false
// console.log(Number.isInteger(3.0)); // true
// console.log(Math.trunc(4.9));       // 4
// console.log(Math.sign(-8));         // -1
// console.log(Number.isSafeInteger(2 ** 53));     // false
// console.log(Number.isSafeInteger(2 ** 53 - 1)); // true


/*
  ============================================================
  18) Object utility methods
  ============================================================

  Object.assign     — shallow copy/merge into target
  Object.is         — SameValue comparison (better than === for NaN / -0)
  Object.keys/values/entries became everyday tools
    (values/entries finalized shortly after ES6, used everywhere now)
*/

// const target = { a: 1 };
// const source = { b: 2, c: 3 };
// console.log(Object.assign(target, source)); // { a:1, b:2, c:3 }
//
// console.log(Object.is(NaN, NaN)); // true
// console.log(NaN === NaN);         // false
// console.log(Object.is(+0, -0));   // false
// console.log(+0 === -0);           // true
//
// const settings = { theme: "dark", lang: "en" };
// console.log(Object.keys(settings));
// console.log(Object.values(settings));
// console.log(Object.entries(settings));


/*
  ============================================================
  19) Proxy & Reflect (metaprogramming)
  ============================================================

  Proxy wraps an object and intercepts fundamental operations:
    get, set, has, deleteProperty, apply, construct, ...

  Reflect provides default implementations of those operations
  as functions (nice for forwarding inside traps).

  Use cases:
    validation, logging, reactive systems, virtual APIs
*/

// const person = { name: "Sam", age: 20 };
//
// const proxied = new Proxy(person, {
//   get(target, prop, receiver) {
//     console.log(`get ${String(prop)}`);
//     return Reflect.get(target, prop, receiver);
//   },
//   set(target, prop, value, receiver) {
//     if (prop === "age" && value < 0) {
//       throw new Error("age must be >= 0");
//     }
//     return Reflect.set(target, prop, value, receiver);
//   },
// });
//
// console.log(proxied.name); // logs get name → "Sam"
// proxied.age = 21;          // ok
// // proxied.age = -1;        // Error


/*
  ============================================================
  QUICK CHEAT SHEET
  ============================================================

  Variables:     let / const (block scope, TDZ)
  Functions:     arrows (lexical this), defaults, rest
  Data sugar:    templates, destructuring, spread, object shorthand
  Structure:     classes, modules
  Async base:    promises
  Collections:   Map, Set, WeakMap, WeakSet
  Protocols:     iterators, for...of, generators, Symbol
  Meta:          Proxy, Reflect

  How to study this file:
    1) read one section
    2) uncomment its demos
    3) predict output before running
    4) compare with console result
*/
