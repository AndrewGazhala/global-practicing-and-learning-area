/* All about functions in javascript */

/* Function declaration */

function add(a, b) {
    return a + b;
}

console.log(add(1, 2));

/* Function expression */

substract(1, 2); // ReferenceError: substract is not defined

const subtract = function(a, b) {
    return a - b;
}

console.log(subtract(1, 2));

/* Arrow function */

const multiply = (a, b) => a * b;

console.log(multiply(1, 2));

/* Function constructor */

const divide = new Function('a', 'b', 'return a / b');

console.log(divide(1, 2));

/* Function hoisting */

console.log(add(1, 2));

/* Function parameters */

function add(a=0, b=0) {
    return a + b;
}

console.log(add(1, 2));

/* Immediately Invoked Function Expression IIFE */   

(function() {
    console.log("Hello from the IIFE");
})();

/* Function as a constructor */

const Person = function(name) {
    this.name = name;
}

const person = new Person("John");

console.log(person.name);

/* Function as a method */

const person = {
    name: "John",
    greet: function() {
        console.log("Hello from the method");
    }
}

person.greet();