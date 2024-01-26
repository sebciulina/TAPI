/*
    Przepisz podany niżej typ `Person` tak, aby funkcja `exam` działała poprawnie. i nie zwracała błędów.
*/

type Student1 = {
    type: 'student';
    takeExam: () => void;
    prepareExam?: never;
};

type Teacher = {
    type: 'teacher';
    takeExam?: never;
    prepareExam: () => void;
};

type Person = Student1 | Teacher;

const exam = (person: Person) => {
    if (person.type === 'student') {
        person.takeExam();
    } else {
        person.prepareExam();
    }
};

const student: Student1 = {
    type: 'student',
    takeExam: () => {
        console.log('Student is taking the exam');
    }
};

const teacher: Teacher = {
    type: 'teacher',
    prepareExam: () => {
        console.log('Teacher is preparing the exam');
    }
};



exam(student); 
exam(teacher);
