let moduleTwoPromise: Promise<string> = new Promise((resolve, reject) => {
    return resolve("Hello from moduleTwo.js");
});

export default moduleTwoPromise;

function hello(): void {
    console.log("Hello from moduleTwo.js");
}

const goodbye = (): void => {
    console.log("Goodbye from moduleTwo.js");
}

const booleanVariable: boolean = true;

let numberVariable: number = 45;

const stringVariable: string = "Hello World";

const arrayVariable: (number | Function | { a: number; b: number; c: number })[] = [1, 2, 3, 4, 5, () => {
    console.log("Hello from the array in moduleTwo.js");
}, { a: 1, b: 2, c: 3 }];

class MyClass {
    name: string;
    constructor(name : string) {
        this.name = name;
    }

    greet() {
        console.log(`Hello, ${this.name}!`);
    }
}   

let myInstance = new MyClass("John");

class AnotherClass extends MyClass {
    age: number;
    constructor(name : string, age : number) {
        super(name);
        this.age = age;
    }

    greet() {
        console.log(`Hello, ${this.name}! You are ${this.age} years old.`);
    }
}

let anotherInstance = new AnotherClass("Jane", 30);

export { hello, goodbye, booleanVariable, numberVariable, stringVariable, arrayVariable, MyClass, AnotherClass, anotherInstance };
