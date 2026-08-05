/*
    Function Hoisting case 1
*/

hello();

function hello() {
    console.log('Say hello');
}

/*
    Function Hoisting case 2
*/

// doSomething1(); 

// Will be ReferenceError
// doSomethingDeep();

function doSomething1() {
    console.log('Do something 1');

    function doSomethingDeep () {
        console.log('Do something 2');
    }
}

/*
    Function Hoisting case 3 (different type of functions arrow function)
*/


/*
    Variable Hoisting var case 1
*/
// console.log(name)
// undefined

var name = "Dillion"

// console.log(name)
// Dillion

/*
    Variable Hoisting var case 2
*/

var age = 44;

// func1();

function func1() {
    

    func2();

    function func2() {

        func3();

        function func3() {
            console.log(age);
        }
    }
}

/*
    Variable Hoisting var case 3
*/

// print()

// console.log(name)
// ReferenceError: name is not defined

function print() {
  var name = "Dillion"
}

/*
    Variable Hoisting var case 4
*/

// print()

function print() {
  console.log(name_1)
  // undefined

  var name_1 = "Dillion"
}

/*
    Variable Hoisting let, const case 1
*/

// console.log(name_2)
// ReferenceError: Cannot access 'name' before initialization

let name_2 = "Dillion"

/*
    Variable Hoisting let, const case 2 tdz
*/

// ReferenceError: Cannot access 'name' before initializati
console.log(myName) // temporal dead zone for myName
// temporal dead zone for myName
// temporal dead zone for myName
// temporal dead zone for myName
// temporal dead zone for myName
// temporal dead zone for myName
// temporal dead zone for myName
const myName = "Dillion"

/*
    Variable Hoisting let, const case 3 tdz in function scope
*/

function print() {
  // temporal dead zone for myName
  // temporal dead zone for myName
  // temporal dead zone for myName
  // temporal dead zone for myName
  console.log(myName) // temporal dead zone for myName
  // temporal dead zone for myName
  // temporal dead zone for myName
  let myName = "Dillion"
}

print()

/*
    Block Scope tdz
*/

if(condition) {
  // block
}

switch(expression) {
    // block
}

for (let a = 1; i < 10; i++) {
    // block
}

{
    // temporal dead zone for myName
  console.log(myName) // temporal dead zone for myName
  // temporal dead zone for myName
  // temporal dead zone for myName
  // temporal dead zone for myName
  // temporal dead zone for myName
  // temporal dead zone for myName
  let myName = "Dillion" // now accessible
  // now accessible
  // now accessible
}

/*
    Class Hoisting case 1
*/

const Dog = new Animal("Bingo")
// ReferenceError: Cannot access 'Animal' before initialization

class Animal {
  constructor(name) {
    this.name = name
  }
}


