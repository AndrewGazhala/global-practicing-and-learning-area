# JS & TS — шпаргалка к собеседованию

Простым языком: что это, зачем, как отвечать на интервью.

Практиковаться удобно в папках `javascipt/` и `typescript/`.

**Как пользоваться:** открой нужный раздел → прочитай «в двух словах» → посмотри пример → попробуй объяснить вслух.

---

## Содержание

1. [Типы в JavaScript](#1-типы-в-javascript)
2. [Типы в TypeScript](#2-типы-в-typescript)
3. [Переменные: var, let, const](#3-переменные-var-let-const)
4. [Hoisting и TDZ](#4-hoisting-и-tdz)
5. [Приведение типов (coercion)](#5-приведение-типов-coercion)
6. [Синтаксис: деструктуризация, spread и др.](#6-синтаксис-деструктуризация-spread-и-др)
7. [Виды функций](#7-виды-функций)
8. [this, call, apply, bind](#8-this-call-apply-bind)
9. [Замыкания (closures)](#9-замыкания-closures)
10. [Области видимости (scope)](#10-области-видимости-scope)
11. [Execution context и call stack](#11-execution-context-и-call-stack)
12. [Массивы](#12-массивы)
13. [Объекты и прототипы](#13-объекты-и-прототипы)
14. [Классы и ООП](#14-классы-и-ооп)
15. [Встроенные объекты](#15-встроенные-объекты)
16. [Итераторы и генераторы](#16-итераторы-и-генераторы)
17. [Модули](#17-модули)
18. [Парадигмы программирования](#18-парадигмы-программирования)
19. [Асинхронность и event loop](#19-асинхронность-и-event-loop)
20. [Обработка ошибок](#20-обработка-ошибок)
21. [Strict mode](#21-strict-mode)
22. [Строки, числа, регулярки](#22-строки-числа-регулярки)
23. [DOM и события в браузере](#23-dom-и-события-в-браузере)
24. [Storage, HTTP, CORS](#24-storage-http-cors)
25. [Паттерны и полезные приёмы](#25-паттерны-и-полезные-приёмы)
26. [Память, копирование, производительность](#26-память-копирование-производительность)
27. [Чем JS отличается от TS](#27-чем-js-отличается-от-ts)
28. [Тесты — коротко](#28-тесты--коротко)
29. [Быстрые вопросы с собеседований](#29-быстрые-вопросы-с-собеседований)
30. [Как повторять по этому репо](#30-как-повторять-по-этому-репо)

---

## 1. Типы в JavaScript

### В двух словах

В JS есть **примитивы** (копируются по значению) и **объекты** (копируются по ссылке).

### Примитивы

| Тип | Пример | `typeof` |
|-----|--------|----------|
| `undefined` | переменная без значения | `"undefined"` |
| `null` | «пусто специально» | `"object"` ← исторический баг |
| `boolean` | `true` / `false` | `"boolean"` |
| `number` | `1`, `3.14`, `NaN` | `"number"` |
| `bigint` | `10n` | `"bigint"` |
| `string` | `"hi"` | `"string"` |
| `symbol` | `Symbol("id")` | `"symbol"` |

### Объекты (всё остальное)

Сюда входят: обычные объекты, массивы, функции, даты, `Map`, `Set`, ошибки и т.д.

```js
typeof []           // "object"
typeof null         // "object"  ← запомнить!
typeof function(){} // "function"

Array.isArray([])   // true — так проверяют массив
x === null          // так проверяют null
```

### Числа: ловушки

```js
NaN === NaN           // false!
Number.isNaN(NaN)     // true — правильная проверка

0.1 + 0.2 === 0.3     // false — особенность float
```

### Передача в функцию

- **Примитив** — внутрь попадает копия значения. Исходник не меняется.
- **Объект / массив** — попадает ссылка. Изменения внутри видны снаружи.

---

## 2. Типы в TypeScript

### В двух словах

TypeScript добавляет **проверку типов на этапе компиляции**. В рантайме остаётся обычный JavaScript — типы стираются.

### База

```ts
let n: number = 1;
let s: string = "a";
let ok: boolean = true;
```

### Особые типы

| Тип | Когда нужен |
|-----|-------------|
| `any` | «выключить проверку» — лучше не использовать |
| `unknown` | «пока не знаю тип» — сначала нужно сузить |
| `never` | функция никогда не возвращает (например, всегда `throw`) |
| `void` | функция ничего полезного не возвращает |

### Структурная типизация

TS смотрит на **форму** объекта, а не на имя типа:

```ts
type Point = { x: number; y: number };

const p = { x: 1, y: 2, z: 3 };
const q: Point = p; // ок — x и y есть
```

### Частые конструкции

```ts
type Id = string | number;              // union — «или»
type Admin = User & { role: "admin" };  // intersection — «и»
type Dir = "up" | "down";               // literal union

function identity<T>(v: T): T {         // generic
  return v;
}
```

### `interface` или `type`?

- **`interface`** — удобно для объектов; можно дополнять (declaration merging).
- **`type`** — для union, tuple, сложных вычисляемых типов.

Для обычных объектов оба варианта нормальны — главное, быть последовательным.

### Полезные утилиты

`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`

---

## 3. Переменные: var, let, const

### В двух словах

В современном коде: почти всегда **`const`**, иногда **`let`**, **`var` не использовать**.

| | `var` | `let` | `const` |
|--|-------|-------|---------|
| Область видимости | функция | блок `{ }` | блок `{ }` |
| Можно объявить снова | да | нет | нет |
| Можно переприсвоить | да | да | нет |
| Hoisting | да → `undefined` | TDZ | TDZ |

```js
const user = { name: "A" };
user.name = "B"; // можно — меняем содержимое
// user = {};    // нельзя — нельзя заменить саму переменную
```

---

## 4. Hoisting и TDZ

### В двух словах

**Hoisting** — движок «поднимает» объявления вверх области видимости до выполнения кода.  
**TDZ** (Temporal Dead Zone) — зона, где `let`/`const`/`class` уже существуют, но ещё недоступны.

### Как ведёт себя разное

```js
// Function declaration — можно вызвать до строки
hello();
function hello() {
  console.log("hi");
}

// var — поднимется как undefined
console.log(a); // undefined
var a = 1;

// let/const — ReferenceError, если тронуть раньше
// console.log(b); // ошибка (TDZ)
let b = 2;
```

**Стрелочные и function expression** не поднимаются как declaration — живут по правилам `let`/`const`/`var`.

Практика: `javascipt/hoisting.js`, `typescript/hoisting.ts`

---

## 5. Приведение типов (coercion)

### В двух словах

JS часто сам превращает типы. На собеседовании любят ловушки с `+`, `==` и falsy-значениями.

### Явное (лучше так)

```js
Number("42");      // 42
String(42);        // "42"
Boolean(1);        // true
parseInt("08", 10); // 8 — radix лучше указывать всегда
```

### Неявное (запомнить)

```js
1 + "2"        // "12"  — плюс любит строки
"2" - 1        // 1     — минус приводит к числу
null + 1       // 1
undefined + 1  // NaN
!!"hello"      // true  — быстрый boolean
```

### Falsy-значения (всё остальное — truthy)

`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`

Важно: `[]` и `{}` — **truthy**. Строка `"0"` — тоже truthy.

### Сравнение

| Оператор | Смысл |
|----------|--------|
| `==` | сравнивает с приведением типов — лучше избегать |
| `===` | строгое сравнение — использовать по умолчанию |
| `Object.is` | ещё строже для `NaN` и `-0` |

```js
null == undefined   // true
null === undefined  // false
```

---

## 6. Синтаксис: деструктуризация, spread и др.

```js
// Деструктуризация
const [a, b = 0] = [1];
const { name, age: years = 18 } = person;

// Spread / rest
const copy = { ...obj };
const merged = [...arr1, ...arr2];
function sum(...nums) {}

// Optional chaining / nullish
user?.profile?.city
value ?? "default"  // только для null/undefined
// || заменяет ещё и 0, "", false — часто это не то, что нужно

x ??= 1; // присвоить, если null/undefined
```

---

## 7. Виды функций

### В двух словах

Функции в JS — **значения первого класса**: их можно класть в переменные, передавать и возвращать.

### По способу записи

| Вид | Пример | Важно |
|-----|--------|--------|
| Declaration | `function foo() {}` | поднимается (hoisting) |
| Expression | `const f = function() {}` | не как declaration |
| Arrow | `const f = () => {}` | лексический `this`, нет `new` |
| Method | `{ m() {} }` | `this` = объект слева от точки |
| Constructor | `function User(){}` / `class` | вызывается через `new` |
| Generator | `function* g(){ yield 1 }` | можно ставить на паузу |
| Async | `async function f(){}` | всегда возвращает Promise |
| IIFE | `(function(){})()` | выполнилась сразу |

### По роли

- **Callback** — передали «вызови меня потом»
- **Higher-order (HOF)** — принимает или возвращает функцию (`map`, `filter`)
- **Pure** — одни и те же аргументы → тот же результат, без побочных эффектов
- **Impure** — читает/меняет внешнее состояние, пишет в сеть/DOM и т.п.
- **Рекурсивная** — вызывает сама себя (нужен базовый случай)

### Arrow vs обычная функция

| | Обычная | Arrow |
|--|---------|--------|
| `this` | зависит от вызова | берётся снаружи (лексический) |
| `arguments` | есть | нет (используй rest) |
| `new` | можно | нельзя |
| Как метод объекта | нормально | обычно плохая идея |

```js
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++; // стрелка сохраняет this = timer
    }, 1000);
  },
};
```

```js
function greet(name = "Guest", ...tags) {}
// default сработает на undefined, но НЕ на null
```

---

## 8. this, call, apply, bind

### В двух словах

`this` внутри функции — это **«кто меня сейчас вызвал»**, а не «в каком объекте меня написали».

Одна и та же функция при разных вызовах может видеть разный `this`.

`call`, `apply`, `bind` — способы **самим сказать**: «вот кто будет `this`».

---

### Аналогия

Представь микрофон (`this`):

- функция — человек, который говорит;
- кто держит микрофон в момент речи — тот и есть `this`;
- можно передать микрофон другому (`call` / `apply` / `bind`).

---

### 1) Вызов как метод объекта → `this` = объект слева от точки

```js
const user = {
  name: "Ada",
  sayHi() {
    console.log("Привет,", this.name);
  },
};

user.sayHi(); // Привет, Ada
//                this === user
```

Ещё пример:

```js
const car = {
  brand: "Toyota",
  show() {
    console.log(this.brand);
  },
};

car.show(); // Toyota
```

---

### 2) Обычный вызов `fn()` → `this` «теряется»

Если функцию достали из объекта и вызвали отдельно — слева от точки уже ничего нет.

```js
const user = {
  name: "Ada",
  sayHi() {
    console.log(this.name);
  },
};

const hi = user.sayHi; // просто положили функцию в переменную
hi(); // undefined  (в strict mode / модулях)
      // this больше НЕ user
```

То же самое с таймером:

```js
setTimeout(user.sayHi, 100);
// через 100мс функция вызовется «сама» → this снова не user
```

**Запомни:** важен не «где функция лежит», а **как её вызвали**.

---

### 3) Вызов через `new` → `this` = новый объект

```js
function User(name) {
  this.name = name;
}

const u = new User("Bob");
console.log(u.name); // Bob
// this внутри конструктора — свежий объект, который вернёт new
```

---

### 4) Стрелочная функция → свой `this` не создаёт

Стрелка берёт `this` **снаружи** (из места, где её написали).

```js
const timer = {
  seconds: 0,
  start() {
    // обычный метод: this === timer

    setInterval(() => {
      // стрелка НЕ делает свой this
      // поэтому this всё ещё timer
      this.seconds += 1;
      console.log(this.seconds);
    }, 1000);
  },
};

timer.start(); // 1, 2, 3...
```

Если внутри поставить обычную функцию — сломается:

```js
const timerBroken = {
  seconds: 0,
  start() {
    setInterval(function () {
      this.seconds += 1; // this уже НЕ timerBroken
      console.log(this.seconds); // NaN / ошибка логики
    }, 1000);
  },
};
```

**Стрелку как метод объекта обычно не пишут:**

```js
const bad = {
  name: "Kit",
  sayHi: () => {
    console.log(this.name); // this НЕ bad
  },
};

bad.sayHi(); // undefined (или что-то из внешней области)
```

---

### call — «вызови функцию прямо сейчас с вот этим this»

Синтаксис:

```js
fn.call(ктоБудетThis, аргумент1, аргумент2, ...)
```

Пример:

```js
function greet(greeting, punct) {
  // this.name — берём из объекта, который передали первым
  console.log(greeting + ", " + this.name + punct);
}

const person = { name: "Sam" };
const other = { name: "Lia" };

greet.call(person, "Hello", "!"); // Hello, Sam!
greet.call(other, "Привет", "."); // Привет, Lia.
```

Ещё пример — «одолжить» метод:

```js
const nums = [5, 1, 9];

// Math.max ждёт список чисел, не массив
console.log(Math.max.call(null, 5, 1, 9)); // 9
```

---

### apply — то же, что call, но аргументы одним массивом

Синтаксис:

```js
fn.apply(ктоБудетThis, [аргумент1, аргумент2, ...])
```

```js
function greet(greeting, punct) {
  console.log(greeting + ", " + this.name + punct);
}

const person = { name: "Sam" };

greet.apply(person, ["Hi", "?"]); // Hi, Sam?
```

Удобно, когда аргументы уже лежат в массиве:

```js
const args = ["Yo", "!!"];
greet.apply(person, args); // Yo, Sam!!

const numbers = [3, 8, 2];
console.log(Math.max.apply(null, numbers)); // 8
```

**Сейчас чаще пишут так (современный стиль):**

```js
Math.max(...numbers); // 8
greet(person.name);   // но для this всё равно нужны call/apply/bind
```

---

### bind — «сделай новую функцию с навсегда пришитым this»

Важно: `bind` **не вызывает** функцию. Он возвращает **новую**.

Синтаксис:

```js
const новаяФункция = fn.bind(ктоБудетThis, заранееАрг1, заранееАрг2)
```

Пример 1 — починить потерю this:

```js
const user = {
  name: "Ada",
  sayHi() {
    console.log(this.name);
  },
};

const hi = user.sayHi.bind(user);

hi();                 // Ada
setTimeout(hi, 100);  // Ada — this уже не потеряется
```

Пример 2 — зафиксировать this и часть аргументов:

```js
function greet(greeting, punct) {
  console.log(greeting + ", " + this.name + punct);
}

const person = { name: "Sam" };

const sayHey = greet.bind(person, "Hey");
sayHey("!!"); // Hey, Sam!!
sayHey("?");  // Hey, Sam?
```

Пример 3 — частичное применение (partial):

```js
function mul(a, b) {
  return a * b;
}

const double = mul.bind(null, 2); // a навсегда = 2
console.log(double(5)); // 10
console.log(double(7)); // 14
```

`null` тут как this, потому что внутри `mul` this не используется.

---

### call vs apply vs bind — простыми словами

| Метод | Что делает | Когда вызывать |
|-------|------------|----------------|
| `call` | вызывает функцию сразу | this + аргументы списком |
| `apply` | вызывает функцию сразу | this + аргументы массивом |
| `bind` | готовит новую функцию | вызвать потом (или много раз) |

Один пример — все три рядом:

```js
function intro(city, job) {
  console.log(this.name + " из " + city + ", работает: " + job);
}

const person = { name: "Andre" };

// call — сразу, аргументы через запятую
intro.call(person, "Kyiv", "developer");
// Andre из Kyiv, работает: developer

// apply — сразу, аргументы массивом
intro.apply(person, ["Lviv", "engineer"]);
// Andre из Lviv, работает: engineer

// bind — не сразу, а «заготовка»
const introAndre = intro.bind(person, "Odesa");
introAndre("mentor");
// Andre из Odesa, работает: mentor
```

---

### Что сильнее: bind уже «пришил» this

```js
function show() {
  console.log(this.name);
}

const a = { name: "A" };
const b = { name: "B" };

const bound = show.bind(a);
bound();           // A
bound.call(b);     // всё равно A — bind сильнее позднего call
bound.apply(b);    // всё равно A
```

---

### Как чинить потерю this на практике

Исходная проблема:

```js
const user = {
  name: "Ada",
  sayHi() {
    console.log(this.name);
  },
};
```

Вариант A — `bind`:

```js
setTimeout(user.sayHi.bind(user), 0); // Ada
```

Вариант B — обёртка + стрелка (очень частый стиль):

```js
setTimeout(() => user.sayHi(), 0); // Ada
```

Вариант C — заранее сохранить метод:

```js
const hi = user.sayHi.bind(user);
button.addEventListener("click", hi);
```

---

### Мини-шпаргалка «что ответить на собесе»

1. `this` зависит от **способа вызова**, не от места объявления.  
2. `obj.fn()` → `this = obj`.  
3. `fn()` само по себе → `this` теряется.  
4. `call`/`apply` задают this и вызывают сразу (`apply` — args массивом).  
5. `bind` возвращает новую функцию с зафиксированным this.  
6. Стрелка this не привязывает сама — берёт с внешней функции.  

---

## 9. Замыкания (closures)

### В двух словах

**Замыкание** — функция + внешние переменные, которые она «помнит», даже когда внешняя функция уже закончилась.

### Пример

```js
function makeCounter() {
  let count = 0; // «приватное» состояние

  return function () {
    count += 1;
    return count;
  };
}

const c1 = makeCounter();
const c2 = makeCounter();

c1(); // 1
c1(); // 2
c2(); // 1  — у каждого счётчика своя память
```

### Зачем нужно

- скрыть данные (приватность)
- фабрики функций
- колбэки и обработчики событий
- каррирование / partial
- мемоизация

### Классическая ловушка с циклом

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // 0, 1, 2
}
```

`var` — одна общая переменная. `let` — своя на каждую итерацию.

### Scope vs closure

- **Scope** — правила, где переменная видна  
- **Closure** — конкретная функция, которая держит свой внешний scope  

---

## 10. Области видимости (scope)

Цепочка обычно такая:

**global → function → block (`let`/`const`)**

Scope в JS **лексический**: важно, *где функцию написали*, а не откуда вызвали.

Внутренняя переменная с тем же именем **затеняет** (shadowing) внешнюю.

---

## 11. Execution context и call stack

### В двух словах

Каждый вызов функции создаёт **контекст выполнения**. Контексты складываются в **call stack** (стек вызовов).

В контексте есть примерно:
- переменные и ссылка на внешний scope
- значение `this`
- аргументы

Если функция бесконечно вызывает сама себя — будет:

`RangeError: Maximum call stack size exceeded`

---

## 12. Массивы

### Создание

```js
[1, 2, 3]
Array.from("ab")  // ["a", "b"]
Array.of(2)       // [2]
```

### Что меняет массив, а что нет

**Меняют исходный:**  
`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`

**Возвращают новый (удобнее для React/стейта):**  
`map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed`, spread `[...arr]`

### Частые методы

`find`, `findIndex`, `includes`, `some`, `every`, `forEach`, `reduce`, `flat`, `flatMap`, `at(-1)`

```js
[1, 2, 3].map((x) => x * 2);     // [2, 4, 6]
[1, 2, 3].filter((x) => x > 1);  // [2, 3]
[1, 2, 3].reduce((s, x) => s + x, 0); // 6
```

---

## 13. Объекты и прототипы

### База

```js
const o = { a: 1, b() {}, [key]: 2 };
Object.assign(target, source);
const copy = { ...source };
```

Проверка своего свойства:

```js
Object.hasOwn(obj, "a"); // современный способ
```

### Прототипы — главная идея ООП в JS

У объекта есть скрытая ссылка `[[Prototype]]`.  
Если свойства нет у самого объекта — JS ищет его выше по цепочке.

```js
function Person(name) {
  this.name = name;
}

Person.prototype.hi = function () {
  return "hi " + this.name;
};

const p = new Person("A");
p.hi(); // "hi A"
Object.getPrototypeOf(p) === Person.prototype; // true
```

`class` — удобный синтаксис поверх той же модели.

---

## 14. Классы и ООП

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {}

  static isAnimal(x) {
    return x instanceof Animal;
  }
}

class Dog extends Animal {
  #chip; // приватное поле

  constructor(name, breed) {
    super(name); // сначала super, потом this
    this.breed = breed;
  }
}
```

На собеседовании часто спрашивают принципы ООП:
- **инкапсуляция** — скрыть детали (`#`, замыкания)
- **наследование** — `extends` / прототипы
- **полиморфизм** — один интерфейс, разное поведение

Практичный совет: чаще лучше **композиция**, чем глубокое наследование.

В TypeScript ещё есть: `public` / `private` / `protected`, `readonly`, `abstract`, `implements`.

---

## 15. Встроенные объекты

**База:** `Object`, `Array`, `String`, `Number`, `Boolean`, `Function`, `Symbol`, `BigInt`, `Error`

**Коллекции:**
- `Map` — ключ любого типа, есть `.size`, порядок вставки
- `Set` — уникальные значения (`[...new Set(arr)]` убирает дубли)
- `WeakMap` / `WeakSet` — слабые ссылки на объекты (удобно для метаданных, не мешают GC)

**Асинхронность:** `Promise`, `fetch`, `AbortController`, таймеры

**Метапрограммирование:** `Proxy`, `Reflect`

---

## 16. Итераторы и генераторы

- **Iterable** — есть метод `[Symbol.iterator]`
- **Iterator** — объект с `next()` → `{ value, done }`

`for...of` — по значениям итерируемого.  
`for...in` — по ключам объекта (для массивов обычно не используют).

```js
function* idMaker() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const ids = idMaker();
ids.next().value; // 1
ids.next().value; // 2
```

---

## 17. Модули

### ESM (современный стандарт)

```js
// math.js
export const PI = 3.14;
export default function mul(a, b) {
  return a * b;
}

// app.js
import mul, { PI } from "./math.js";
const mod = await import("./lazy.js"); // динамический импорт
```

Особенности: свой scope, strict mode, статический разбор, live bindings.

### CommonJS (старый Node)

```js
module.exports = { add };
const { add } = require("./math");
```

| | ESM | CJS |
|--|-----|-----|
| Как подключается | `import` / `import()` | `require` |
| В браузере | да | нет |
| Tree-shaking | хорошо | плохо |

---

## 18. Парадигмы программирования

JS/TS — **мультипарадигменные**. Это нормальный ответ на интервью.

| Парадигма | Суть |
|-----------|------|
| Императивная | «сделай шаг 1, шаг шаг 2» |
| Декларативная | «хочу такой результат» (`map`, JSX) |
| ООП | объекты, классы/прототипы |
| Функциональная | чистые функции, неизменяемость, HOF |
| Событийная | слушатели, колбэки, промисы |

---

## 19. Асинхронность и event loop

### В двух словах

JS однопоточный. Долгие операции не «висят» в том же потоке — их ждёт окружение, а результат потом ставится в очередь.

### Порядок важности

1. Синхронный код (call stack)  
2. **Все** microtasks (Promise `.then`, `queueMicrotask`)  
3. Один macrotask (`setTimeout`, I/O, UI-события)  
4. Снова microtasks …

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);

// 1, 4, 3, 2
```

### Promise

Состояния: `pending` → `fulfilled` или `rejected`.

| Метод | Поведение |
|-------|-----------|
| `Promise.all` | ждёт все; падает на первой ошибке |
| `Promise.allSettled` | ждёт все; ошибки не роняют весь набор |
| `Promise.race` | побеждает первый завершившийся |
| `Promise.any` | побеждает первый успешный |

`async/await` — синтаксический сахар над промисами.

Практика: `javascipt/asynchronous.js`, `typescript/asynchronous.ts`

---

## 20. Обработка ошибок

```js
try {
  throw new TypeError("bad");
} catch (err) {
  if (err instanceof TypeError) {
    // обработали
  } else {
    throw err; // остальное пробрасываем выше
  }
} finally {
  // выполнится всегда — закрыть файл, убрать лоадер и т.п.
}
```

Частые типы: `Error`, `TypeError`, `ReferenceError`, `SyntaxError`, `RangeError`, `AggregateError`.

Для async — `try/catch` вокруг `await` или `.catch()` у промиса.

Практика: `javascipt/errorHandling.js`, `typescript/errorHandling.ts`

---

## 21. Strict mode

`"use strict";`  
В ES-модулях строгий режим уже включён.

Что даёт:
- нельзя писать в необъявленную переменную
- обычный вызов функции → `this === undefined` (не global)
- меньше странных тихих багов

---

## 22. Строки, числа, регулярки

### Строки

Неизменяемые. Методы возвращают новую строку:

`slice`, `split`, `trim`, `includes`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `padStart`

```js
`Привет, ${name}!` // template literal
```

### Числа

```js
Number.isFinite(x)
Number.isInteger(x)
Number.isSafeInteger(x)
```

Для очень больших целых — `BigInt` (`10n`). Смешивать с `number` без преобразования нельзя.

### RegExp

```js
/^\d+$/.test("42"); // true
"a1b".replace(/\d/, "X"); // "aXb"
```

---

## 23. DOM и события в браузере

### Три фазы события

1. **Capture** — сверху вниз  
2. **Target** — на целевом элементе  
3. **Bubble** — снизу вверх  

```js
el.addEventListener("click", handler);
```

### Делегирование

Вешаем слушатель на родителя и смотрим `event.target` — удобно для списков.

### Полезные различия

| Метод / свойство | Зачем |
|------------------|--------|
| `preventDefault()` | отменить действие браузера (submit, переход по ссылке) |
| `stopPropagation()` | остановить всплытие/погружение |
| `event.target` | элемент, на котором реально кликнули |
| `event.currentTarget` | элемент, на котором висит обработчик |

---

## 24. Storage, HTTP, CORS

### Хранилища

| | Живёт | Примерный размер | Уходит на сервер? |
|--|-------|------------------|-------------------|
| `localStorage` | пока не очистят | ~5MB | нет |
| `sessionStorage` | пока вкладка жива | ~5MB | нет |
| cookies | настраивается | ~4KB | да (часто) |

Чувствительные токены в `localStorage` — плохая идея.

### HTTP коротко

- Методы: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Статусы: `2xx` ок, `4xx` ошибка клиента, `5xx` ошибка сервера

### CORS

Браузер блокирует ответ с другого origin, если сервер не разрешил это заголовками `Access-Control-*`.  
С фронта CORS «не чинится» — разрешение должно быть на бэке.

---

## 25. Паттерны и полезные приёмы

### Частые паттерны

| Паттерн | Идея |
|---------|------|
| Module | спрятать внутренности, отдать публичный API |
| Factory | функция создаёт объекты |
| Observer / PubSub | подписка на события |
| Middleware | цепочка обработчиков с `next` |
| Strategy | разные алгоритмы за одним интерфейсом |

### Currying

```js
const add = (a) => (b) => a + b;
add(1)(2); // 3
```

### Partial application

Заранее зафиксировать часть аргументов:

```js
const mul = (a, b) => a * b;
const triple = (n) => mul(3, n);
```

### Debounce и throttle

- **Debounce** — подождать паузу в событиях (поиск при вводе)
- **Throttle** — не чаще, чем раз в N мс (scroll)

### Мемоизация

Кэш результатов чистой функции, чтобы не считать повторно.

---

## 26. Память, копирование, производительность

- Сборщик мусора сам удаляет недостижимые объекты
- Замыкания и кэши могут случайно держать лишнюю память

```js
const shallow = { ...obj };           // вложенные объекты — те же ссылки
const deep = structuredClone(obj);    // глубокая копия
```

`JSON.parse(JSON.stringify(obj))` — грубый deep clone: теряет функции, `undefined`, `Date` и т.д.

---

## 27. Чем JS отличается от TS

| Тема | JavaScript | TypeScript |
|------|------------|------------|
| Типы | только в рантайме | проверка при компиляции |
| Ошибки формы данных | часто уже в проде | многие ловятся раньше |
| `catch (e)` | что угодно | лучше `unknown` + сужение |
| Generics | нет | есть |
| Интерфейсы | нет | есть |
| В рантайме | JS | тоже JS (типы стёрты) |

**Важно сказать на интервью:** TypeScript сам по себе не проверяет типы во время выполнения. Для данных с сервера нужны валидаторы (например, zod).

---

## 28. Тесты — коротко

Цепочка от мелкого к крупному: **unit → integration → e2e**.

Чистые функции тестировать проще всего.

Подробнее: `notes/tests.md`

---

## 29. Быстрые вопросы с собеседований

Попробуй ответить вслух на каждый:

1. Чем `==` отличается от `===`?
2. Чем `null` отличается от `undefined`?
3. Что такое замыкание? Пример?
4. Что такое hoisting и TDZ?
5. Что такое event loop? Microtask vs macrotask?
6. Чем стрелка отличается от обычной функции?
7. Чем отличаются `call`, `apply`, `bind`?
8. Какие виды функций знаешь?
9. Чем shallow copy отличается от deep copy?
10. Чем `map` отличается от `forEach`?
11. Состояния Promise? Зачем `all` / `allSettled` / `race` / `any`?
12. Что возвращает `async`-функция?
13. ESM vs CommonJS?
14. Что такое чистая функция?
15. Прототип vs `class`?
16. `any` vs `unknown`?
17. `interface` vs `type`?
18. Перечисли falsy-значения.
19. Почему `typeof null === "object"`?
20. Debounce vs throttle?
21. Всплытие и погружение событий? Что такое делегирование?
22. Как определяется `this`?
23. Что такое IIFE и зачем она была нужна?
24. Currying vs partial application?
25. Почему в цикле с `var` + `setTimeout` печатается одно и то же число?
26. Как сделать приватные данные в JS?
27. Что такое higher-order function?
28. Что такое CORS одним предложением?
29. Существует ли TypeScript в рантайме?
30. Что такое execution context?

---

## 30. Как повторять по этому репо

| Тема | Файл |
|------|------|
| Асинхронность | `javascipt/asynchronous.js`, `typescript/asynchronous.ts` |
| ES6+ | `javascipt/es6.js`, `typescript/es6.ts` |
| Hoisting | `javascipt/hoisting.js`, `typescript/hoisting.ts` |
| Ошибки | `javascipt/errorHandling.js`, `typescript/errorHandling.ts` |
| Функции | `javascipt/functions.js`, `typescript/functions.ts` |
| Тесты | `notes/tests.md` |

**Формула повторения:**

1. Прочитал раздел  
2. Объяснил своими словами вслух  
3. Раскомментировал пример в файле  
4. Угадал результат  
5. Запустил и сверил  

### 8 опорных идей, которые стоит держать в голове

1. Примитив копируется, объект передаётся по ссылке  
2. Scope лексический; у `let`/`const` есть TDZ  
3. `this` зависит от способа вызова; у стрелки — от места создания  
4. Замыкание = функция + помнящиеся внешние переменные  
5. Стек → microtasks → macrotask  
6. Классы — сахар над прототипами  
7. Функциональный стиль: чистые функции + неизменяемость  
8. TypeScript проверяет контракты при сборке; на границе с API всё равно нужна валидация  
