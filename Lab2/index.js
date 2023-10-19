const { faker } = require('@faker-js/faker');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

faker.seed(100);

const students = [];
const groups = [];
const instructors = [];
const rooms = [];

for (let i = 1; i <= 10; i++) {
  const schedule = generateRandomSchedule();
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

function generateRandomSchedule() {
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
    const { od, dO } = req.query;
  
    if (id === 'all') {
      const allStudentSchedules = students.map(student => ({
        student: student.name,
        schedule: student.schedule,
      }));
      res.json(allStudentSchedules);
    } else {
      const student = students.find(student => student.id == id);
  
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      if (od && dO) {
        const fromDate = new Date(od);
        const toDate = new Date(dO);
  
        const filteredSchedule = student.schedule.filter(item => {
          const itemDate = new Date(item.time);
          return itemDate >= fromDate && itemDate <= toDate;
        });
  
        if (filteredSchedule.length > 0) {
          res.json({ student: student.name, schedule: filteredSchedule });
        } else {
          res.status(404).json({ error: 'No events found in the specified date range' });
        }
      } else {
        res.json({ student: student.name, schedule: student.schedule });
      }
    }
  });
  

app.get('/grupa/:nazwa', (req, res) => {
  const { nazwa } = req.params;

  if (nazwa === 'all') {
    const allGroupSchedules = groups.map(group => ({
      group: group.name,
      schedule: group.schedule,
    }));
    res.json(allGroupSchedules);
  } else {
    const group = groups.find(group => group.name === nazwa);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({ group: group.name, schedule: group.schedule });
  }
});

app.get('/wykladowca/:id', (req, res) => {
  const { id } = req.params;

  if (id === 'all') {
    const allInstructorSchedules = instructors.map(instructor => ({
      instructor: instructor.name,
      schedule: instructor.schedule,
    }));
    res.json(allInstructorSchedules);
  } else {
    const instructor = instructors.find(instructor => instructor.id == id);

    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    res.json({ instructor: instructor.name, schedule: instructor.schedule });
  }
});

app.get('/sala/:nr', (req, res) => {
  const { nr } = req.params;

  if (nr === 'all') {
    const allRoomSchedules = rooms.map(room => ({
      room: room.nr,
      schedule: room.schedule,
    }));
    res.json(allRoomSchedules);
  } else {
    const room = rooms.find(room => room.nr === nr);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ room: room.nr, schedule: room.schedule });
  }
});

app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});
