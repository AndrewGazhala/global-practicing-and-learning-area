import {arrayVariable as arrayVariableFromModuleTwo} from './moduleTwo.js';

let arrayVariable1 = Array.from([1, 2, 3, 4, 5]);

let arrayVariable2 = Array.from(new Map([['a', 1], ['b', 2], ['c', 3]]));

let arrayVariable3 = Array.from(new Set([1, 2, 3, 4, 5]));

let arrayVariable4: string[] = Array.from('Hello World');

let arrayVariable5 = arrayVariable1.concat(arrayVariable3, arrayVariable1);

for (const value of arrayVariable5) {
    console.log(value);
}
