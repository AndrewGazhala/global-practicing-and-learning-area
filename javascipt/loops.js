// Loops are used to execute a block of code multiple times.

/* 1 For loop */
// for (let i = 0; i < 10; i++) {
//     console.log(i);
// }

// for (let i = 20; i > 0; i -= 3) {
//     console.log(i);
// }

/* 2 While loop */

// while (true) {
//     console.log("Hello");
//     break;  // If no break, infinite loop will happen
// }

/* 3 Do while loop */

// do {
//     console.log('do while loop');
// } while (false);

/* 4 Break and continue */

/* 5 Nested loops */

/* 6 Loop through an object */

// const obj = {
//     name: "John",
//     age: 20, 
//     hometown: "New York"
// };

// for (const key in obj) {
//     console.log(key);
// }

// for (const key of Object.keys(obj)) {
//     console.log(key);
// }

// for (const value of Object.values(obj)) {
//     console.log(value);
// }

// for (const [key, value] of Object.entries(obj)) {
//     console.log(key, value);
// }

/* 7 Loop through an array */

// const arr = [1, 2, 3, 4, 5];

// for (const value of arr) {
//     console.log(value);
// }

/* loop through a Map */
// const map = new Map([["a", 1], ["b", 2], ["c", 3]]);

// for (const [key, value] of map) {
//     console.log(key, value);
// }

/* loop through a Set */

// const set = new Set([1, 2, 3, 4, 5]);

// for (const item of set) {
//     console.log(item);
// }

/* loop through a weak map */

// const weakMap = new WeakMap([[{}, 1], [{}, 2], [{}, 3]]); // WeakMap is not iterable

// for (const [key, value] of weakMap) { // TypeError: weakMap is not iterable
//     console.log(key, value);
// }

/* Loop through a weak set */

// const weakSet = new WeakSet([{}, {}, {}]); // WeakSet is not iterable

// for (const item of weakSet) { // TypeError: weakSet is not iterable
//     console.log(item);
// }

/* Loop through a string */
// const str = "Iterable string";

// for (const char of str) {
//     console.log(char);
// }

/* Not iterable: number, bigint, boolean, undefined, null */
// for...of on any of these throws TypeError (they have no Symbol.iterator).
// for (const x of 10) {} // TypeError: 10 is not iterable
// for (const x of true) {} // TypeError: true is not iterable
// for (const x of undefined) {} // TypeError: undefined is not iterable
// for (const x of null) {} // TypeError: null is not iterable

// To count with a number, use a classic for / while:
// const num = 10;
// for (let i = 0; i < num; i++) {
//     console.log(i); // 0, 1, 2, ... 9
// }