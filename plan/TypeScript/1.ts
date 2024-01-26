/*
    Utwórz typy dla studenta oraz nauczyciela.

    Student powinien mieć:
    - imię
    - nazwisko
    - numer indeksu
    - listę zajęć na które uczęszcza
    - listę ocen (może nie posiadać żadnej)
    - informację czy studia skończone

    Nauczyciel powinien mieć:
    - imię
    - nazwisko
    - przedmiot
    - przygotowane egzaminy (których typu nie znamy ;) )
    - funkcję do przeprowadzania egzaminu

    Stwórz również typ dla tablicy, która może zawierać zarówno studentów jak i nauczycieli.
    Stwórz typ na podstawie typu studenta oraz nauczyciela, który pozwoli nam wypisać ich imiona oraz nazwiska.
*/


type Student = {
    imie: string;
    nazwisko: string;
    indeks: number;
    zajecia: string[];
    oceny: number[];
    studia_ukonczone: boolean;
} 

type Nauczyciel = {
    imie: string;
    nazwisko: string;
    przedmiot: string;
    egzaminy: unknown[];
    przeprowadzEgzamin: () => void;
}

type tablicaOsob =(Student | Nauczyciel)[]
type zwrocImionaNazwiska = Pick<Student | Nauczyciel, "imie" | "nazwisko">;