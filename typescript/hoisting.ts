/*
    Function Hoisting case 1
*/

hello();

function hello(): void {
  console.log("Say hello");
}

/*
    Function Hoisting case 2
*/

// doSomething1();

// Will be ReferenceError
// doSomethingDeep();

function doSomething1(): void {
  console.log("Do something 1");

  function doSomethingDeep(): void {
    console.log("Do something 2");
  }
}

/*
    Function Hoisting case 3 (different type of functions arrow function)

    Arrow / const functions are NOT hoisted like function declarations.
    They live in the TDZ until initialized (same as let/const).
*/

// sayHi(); // ReferenceError / TS error: used before declaration
// const sayHi = (): void => {
//   console.log("Hi");
// };

/*
    Variable Hoisting var case 1

    Note: avoid top-level `var name` in TS+DOM — `name` exists on Window.
    Use a different identifier for the learning demo.
*/
// console.log(personName)
// undefined

var personName = "Dillion";

// console.log(personName)
// Dillion

/*
    Variable Hoisting var case 2
*/

var age = 44;

// func1();

function func1(): void {
  func2();

  function func2(): void {
    func3();

    function func3(): void {
      console.log(age);
    }
  }
}

/*
    Variable Hoisting var case 3
*/

// printVarScope()

// console.log(name)
// ReferenceError: name is not defined

function printVarScope(): void {
  var name = "Dillion";
}

/*
    Variable Hoisting var case 4
*/

// printVarBeforeInit()

function printVarBeforeInit(): void {
  // console.log(name_1);
  // undefined — var is hoisted as undefined at runtime
  // TypeScript may still report "used before being assigned"

  var name_1 = "Dillion";
  console.log(name_1);
}

/*
    Variable Hoisting let, const case 1
*/

// console.log(name_2)
// ReferenceError: Cannot access 'name_2' before initialization
// TypeScript also errors at compile time if you uncomment above.

let name_2 = "Dillion";

/*
    Variable Hoisting let, const case 2 tdz

    In the JS file this runs and throws at runtime.
    In TypeScript, accessing before init is a compile-time error —
    keep demos commented while learning, then uncomment one at a time.
*/

// ReferenceError: Cannot access 'myName' before initialization
// console.log(myName); // temporal dead zone for myName
// temporal dead zone for myName
const myName = "Dillion";

/*
    Variable Hoisting let, const case 3 tdz in function scope
*/

function printTdzInFunction(): void {
  // temporal dead zone for localMyName
  // console.log(localMyName); // temporal dead zone — uncomment to see TDZ
  let localMyName = "Dillion";
  console.log(localMyName);
}

printTdzInFunction();

/*
    Block Scope tdz
*/

// Placeholder shapes (same idea as the JS sketch):
// if (condition) { /* block */ }
// switch (expression) { /* block */ }
// for (let a = 1; a < 10; a++) { /* block */ }

{
  // temporal dead zone for blockName
  // console.log(blockName); // temporal dead zone — uncomment to see TDZ
  let blockName = "Dillion"; // now accessible
  console.log(blockName);
}

/*
    Class Hoisting case 1

    Classes are in the TDZ until initialized (not like function declarations).
    TypeScript catches "used before declaration" at compile time.
*/

// const dog = new Animal("Bingo");
// ReferenceError: Cannot access 'Animal' before initialization

class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const dog = new Animal("Bingo");
console.log(dog.name);
