import { faker } from '@faker-js/faker';
import express from 'express';
import cors from "cors";
import { createServer } from "node:http";
import fs from "fs";
// import { io } from "./websocket/socket.js"
import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express'


// const packageDefinition = protoLoader.loadSync('grpc/proto/schedule.proto');
// const scheduleProto = grpc.loadPackageDefinition(packageDefinition);

// const client = new scheduleProto.ScheduleService('127.0.0.1:9090', grpc.ChannelCredentials.createInsecure());

const app = express();
const port = 3000;
app.use(express.json());

const server = createServer(app);

app.use(cors({
    origin: '*'
}));

faker.seed(100);

const doc = {
    info: {
      title: 'Schedule API',
      description: 'Schedule API'
    },
    host: 'localhost:3000',
    components: {
        schemas: {
            student: {
                "student": "Judy Mayer",
                "schedule": [
                {
                "time": "2024-06-01T23:30:37.008Z",
                "subject": "speciosus cibo"
                },
                {
                "time": "2024-04-15T00:48:34.167Z",
                "subject": "currus est"
                },
                {
                "time": "2024-09-19T23:31:18.754Z",
                "subject": "arcesso abeo"
                },
                {
                "time": "2024-01-12T20:04:19.990Z",
                "subject": "animus audentia"
                },
                {
                "time": "2024-07-18T11:02:41.838Z",
                "subject": "bellum trepide"
                }
                ]
                }
                

            
        }
    }
  };

const swaggerDocument = './swagger.json';
const routes = ['./index.js'];

const def = await swaggerAutogen({openapi: '3.0.0'})
(swaggerDocument, routes, doc);

if(def){
   app.use('/swagger', swaggerUi.serve, swaggerUi.setup(def.data)); 
}

const students = [];
const groups = [];
const instructors = [];
const rooms = [];

const dataFileName = 'data.json';

for (let i = 1; i <= 10; i++) {
    const schedule = generateSchedule();
    students.push({
        id: i,
        name: faker.person.fullName(),
        admissionDate: faker.date.past(),
        schedule: schedule,
    });
    groups.push({ name: `${i}`, schedule: schedule });
    instructors.push({ id: i, name: faker.person.fullName(), schedule: schedule });
    rooms.push({ nr: `${i}`, schedule: schedule });
}

function generateSchedule() {
    const schedule = [];

    for (let i = 1; i <= 5; i++) {
        schedule.push({
            time: faker.date.future(),
            subject: faker.lorem.words(2),
        });
    }

    return schedule;
}

function readDataFromFile() {
    try {
        const data = fs.readFileSync(dataFileName, 'utf-8');
        const parsedData = JSON.parse(data);
        students.push(...parsedData.students);
        groups.push(...parsedData.groups);
        instructors.push(...parsedData.instructors);
        rooms.push(...parsedData.rooms);
    } catch (err) {
        
    }
}

function saveDataToFile() {
    const dataToSave = {
        students,
        groups,
        instructors,
        rooms
    };
    fs.writeFileSync(dataFileName, JSON.stringify(dataToSave, null, 2));
}

saveDataToFile();
readDataFromFile();


app.get('/student/:id', (req, res) => {
    // #swagger.tags = ['Studenci']
    // #swagger.summary = 'Wyswietlanie studentow w postaci JSON'
    // #swagger.description = 'Wyswietlenie wszystkich studentow - http://localhost:3000/student/all <br /> Wyswietlanie konkretnego studenta - http://localhost:3000/student/id (Gdzie id to nr indeksu studenta) <br /> Wyswietlanie konkretnego studenta z zajeciami w przedziale datowym - http://localhost:3000/student/id?od={dataOd}&do={dataDo} <br /> Przykladowe zapytanie - localhost:3000/student/1?od=2024-03-17T22:40:36.029Z&do=2024-05-04T21:22:38.870Z'
     /* #swagger.responses[200] = {
            description: "Ok",
            content: {
                "json": {
                    schema:{
                        $ref: "#/components/schemas/student"
                    }
                }           
            }
        }   
    */
    // #swagger.responses[404] = { description: 'Nie znaleziono studenta o danym id badz przedziale datowym' }
    // #swagger.parameters['id'] = { description: 'Liczba lub all' }
    // #swagger.parameters['Od'] = { description: 'Data w formacie YYYY-MM-DD' }
    // #swagger.parameters['Do'] = { description: 'Data w formacie YYYY-MM-DD' }
    const { id } = req.params;
    const { Od, Do } = req.query;
    console.time("student");

    if (id === 'all') {
        const allStudentSchedules = students.map(student => ({
            student: student.name,
            schedule: student.schedule,
        }));
        res.json(allStudentSchedules);
        console.timeEnd("student")
    } else {
        const student = students.find(student => student.id == id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        if (Od && Do) {
            const fromDate = new Date(Od);
            const tOdate = new Date(Do);

            const filteredSchedule = student.schedule.filter(item => {
                const itemDate = new Date(item.time);
                return itemDate >= fromDate && itemDate <= tOdate;
            });

            if (filteredSchedule.length > 0) {
                res.json({ student: student.name, schedule: filteredSchedule });
            } else {
                res.status(404).json({ error: 'No events found in the specified date range' });
                console.timeEnd("student");
            }
        } else {
            // client.GetStudent({studentId: "1"}, (err, response) => {
            //     if(err!==null){
            //         console.log(err);
            //     }
            //     else{
            //         res.send(response);
            //     }
            // });
            res.json({ student: student.name, schedule: student.schedule });
            console.timeEnd("student");
        }
    }
});

app.get('/studentjson/:id', (req, res) => {
    // #swagger.tags = ['Studenci']
    const { id } = req.params;
    const { Od, Do } = req.query;
    console.time("studentJson");

    const rawData = fs.readFileSync('data.json');
    const data = JSON.parse(rawData);
    const students = data.students;

    if (id === 'all') {
        const allStudentSchedules = students.map(student => ({
            student: student.name,
            schedule: student.schedule,
        }));
        res.json(allStudentSchedules);
        console.timeEnd("studentJson");
    } else {
        const student = students.find(student => student.id == id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        if (Od && Do) {
            const fromDate = new Date(Od);
            const tOdate = new Date(Do);

            const filteredSchedule = student.schedule.filter(item => {
                const itemDate = new Date(item.time);
                return itemDate >= fromDate && itemDate <= tOdate;
            });

            if (filteredSchedule.length > 0) {
                res.json({ student: student.name, schedule: filteredSchedule });
            } else {
                res.status(404).json({ error: 'No events found in the specified date range' });
                console.timeEnd("studentJson");
            }
        } else {
            res.json({ student: student.name, schedule: student.schedule });
            console.timeEnd("studentJson");
        }
    }
});

app.get('/grupa/:nazwa', (req, res) => {
    // #swagger.tags = ['Grupy']
    const { nazwa } = req.params;
    const { Od, Do } = req.query;
    console.time("grupa");
    if (nazwa === 'all') {
        const allGroupSchedules = groups.map(group => ({
            group: group.name,
            schedule: group.schedule,
        }));
        res.json(allGroupSchedules);
        console.timeEnd("grupa");
    } else {
        const group = groups.find(group => group.name === nazwa);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        if (Od && Do) {
            const fromDate = new Date(Od);
            const tOdate = new Date(Do);

            const filteredSchedule = group.schedule.filter(item => {
                const itemDate = new Date(item.time);
                return itemDate >= fromDate && itemDate <= tOdate;
            });

            if (filteredSchedule.length > 0) {
                res.json({ group: group.name, schedule: filteredSchedule });
                console.timeEnd("grupa");
            } else {
                res.status(404).json({ error: 'No events found in the specified date range' });
            }
        }else {
            res.json({ group: group.name, schedule: group.schedule });
            console.timeEnd("grupa");
        }

    }
});

app.get('/wykladowca/:id', (req, res) => {
    // #swagger.tags = ['Wykladowcy']
    const { id } = req.params;
    const { Od, Do } = req.query;
    console.time("wykladowca");
    if (id === 'all') {
        const allInstructorSchedules = instructors.map(instructor => ({
            instructor: instructor.name,
            schedule: instructor.schedule,
        }));
        res.json(allInstructorSchedules);
        console.timeEnd("wykladowca");
    } else {
        const instructor = instructors.find(instructor => instructor.id == id);

        if (!instructor) {
            return res.status(404).json({ error: 'Instructor not found' });
        }
        if (Od && Do) {
            const fromDate = new Date(Od);
            const tOdate = new Date(Do);

            const filteredSchedule = instructor.schedule.filter(item => {
                const itemDate = new Date(item.time);
                return itemDate >= fromDate && itemDate <= tOdate;
            });

            if (filteredSchedule.length > 0) {
                res.json({ instructor: instructor.name, schedule: filteredSchedule });
                console.timeEnd("wykladowca");
            } else {
                res.status(404).json({ error: 'No events found in the specified date range' });
            }
        }else{
           res.json({ instructor: instructor.name, schedule: instructor.schedule });
           console.timeEnd("wykladowca"); 
        }
        
    }
});

app.get('/sala/:nr', (req, res) => {
    // #swagger.tags = ['Sale']
    const { nr } = req.params;
    const { Od, Do } = req.query;
    console.time("sala");
    if (nr === 'all') {
        const allRoomSchedules = rooms.map(room => ({
            room: room.nr,
            schedule: room.schedule,
        }));
        res.json(allRoomSchedules);
        console.timeEnd("sala");
    } else {
        const room = rooms.find(room => room.nr === nr);

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (Od && Do) {
            const fromDate = new Date(Od);
            const tOdate = new Date(Do);

            const filteredSchedule = room.schedule.filter(item => {
                const itemDate = new Date(item.time);
                return itemDate >= fromDate && itemDate <= tOdate;
            });

            if (filteredSchedule.length > 0) {
                res.json({ room: room.nr, schedule: filteredSchedule });
                console.timeEnd("sala");
            } else {
                res.status(404).json({ error: 'No events found in the specified date range' });
            }
        }else{
           res.json({ room: room.nr, schedule: room.schedule }); 
           console.timeEnd("sala");
        }

        
    }
});

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
