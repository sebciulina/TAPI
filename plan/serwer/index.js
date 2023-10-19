import { faker } from '@faker-js/faker';
import express from 'express';
import cors from "cors";
import { createServer } from "node:http";
// import { io } from "./websocket/socket.js"

const app = express();
const port = 3000;
app.use(express.json());

const server = createServer(app);

app.use(cors({
    origin: '*'
}));

faker.seed(100);

const students = [];
const groups = [];
const instructors = [];
const rooms = [];

for (let i = 1; i <= 10; i++) {
    const schedule = generateRanDomSchedule();
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

function generateRanDomSchedule() {
    const schedule = [];

    for (let i = 1; i <= 5; i++) {
        schedule.push({
            time: faker.date.future(),
            subject: faker.lorem.words(2),
        });
    }

    return schedule;
}

app.get('/student/:id', (req, res) => {
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
            res.json({ student: student.name, schedule: student.schedule });
            console.timeEnd("student");
        }
    }
});


app.get('/grupa/:nazwa', (req, res) => {
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
