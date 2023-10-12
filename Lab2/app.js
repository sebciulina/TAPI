const { faker } = require('@faker-js/faker');
const express = require('express');

faker.seed(100);

const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 3000;


function createRandomStudents() {
    const student = {};
    
    for(i=1; i<=100; i++){
        student[i] = {
            "id": i,
            "Name": faker.person.firstName(),
            "Last name": faker.person.lastName(),
            "Email": faker.internet.email()
        }
    }

    return student;
}

 const student = createRandomStudents();

app.get("/student", (request, response) => {
    response.send(student);
});

app.get("/student/:id", (request, response) => { 
    const id = request.params.id;
    response.send(student[id]);
 });


app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

