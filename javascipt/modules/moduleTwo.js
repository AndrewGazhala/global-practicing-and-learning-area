let moduleTwoPromise = new Promise((resolve, reject) => {
    return resolve("Hello from moduleTwo.js");
});

export default moduleTwoPromise;

function hello() {
    console.log("Hello from moduleTwo.js");
}

const goodbye = () => {
    console.log("Goodbye from moduleTwo.js");
}

const booleanVariable = true;

let numberVariable = 45;

const stringVariable = "Hello World";

const arrayVariable = [1, 2, 3, 4, 5, () => {
    console.log("Hello from the array in moduleTwo.js");
}, { a: 1, b: 2, c: 3 }];

class MyClass {
    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(`Hello, ${this.name}!`);
    }
}   

let myInstance = new MyClass("John");

class AnotherClass extends MyClass {
    constructor(name, age) {
        super(name);
        this.age = age;
    }

    greet() {
        console.log(`Hello, ${this.name}! You are ${this.age} years old.`);
    }
}

let anotherInstance = new AnotherClass("Jane", 30);

export { hello, goodbye, booleanVariable, numberVariable, stringVariable, arrayVariable, MyClass, AnotherClass, anotherInstance };
