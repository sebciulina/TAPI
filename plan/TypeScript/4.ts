/*
    Utwórz typ tuple, który przyjmie numer indeksu studenta, oraz jego ocenę, i nic więcej.
    Stwórz przykładową tablicę takich tupli.
*/

type StudentGradeTuple = [number, number];

const studentGrades: StudentGradeTuple[] = [
    [22990, 5],
    [22991, 3],
    [22992, 4],
    [22993, 2],
];

for (const [index, grade] of studentGrades) {
    console.log(`Student ${index} received a grade of ${grade}`);
}