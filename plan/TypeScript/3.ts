/*
    Stwóz funkcję, która będzie mogła przyjmować wiele argumentów typu number lub string.

*/

function processArguments(...args: (number | string)[]): void {
    for (let i = 0; i < args.length; i++) {
        console.log(args[i]);
    }
}

processArguments(1, "two", 3, "four", 5);
