export let firstName = "John";
export let lastName = "Doe";
export let age = 47;
export let bigIntVariable = 10n;
export let symbolVariable = Symbol("Hello");
export let booleanVariable = true;
export let nullVariable = null;
export let undefinedVariable = undefined;
export let objectVariable = {
    firstName: "John",
    lastName: "Doe",
    age: 47
};
export let arrayVariable = [1, 2, 3, 4, 5];
export let functionExpression = function() {
    console.log("Hello from the function expression");
};
export let functionDeclaration = function hello() {
    console.log("Hello from the function declaration");
};
export let arrowFunction = () => {
    console.log("Hello from the arrow function");
};
export let classDeclaration = class {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
};