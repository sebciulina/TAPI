/*
    Stwórz funkcję która będzie mogła przyjmować wiele argumentów typu number lub string.
    Dopisz do tej funkcji ciało, które zwróci sumę wszystkich liczb.
    Jeśli podana liczba będzie stringiem należy ją sparsować do typu number.

    Dodaj do funkcji argument boolean, na podstawie któego zwracany wynik będzie typu number lub string.
*/

function sum(firstNumber: string | number, ...restOfNumbers: (string | number)[]) {

    var sum: number = + firstNumber

    for (let i = 0; i < restOfNumbers.length; i++) {
        sum += +restOfNumbers[i]
    }

    return sum;
};

let result = sum(1, "2", 3, "4");
console.log(result)