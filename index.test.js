const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('./index');
const User = require('./models/User');
const Slot = require('./models/Slot');
const Appointment = require('./models/Appointment');

describe('College Appointment System E2E', () => {
  let studentA1Token, studentA2Token, professorP1Token;
  const T1 = '2024-06-01T10:00';
  const T2 = '2024-06-01T11:00';

  
  beforeAll(async () => {
    console.log('\n Starting Test Setup...');
    // Waits for MongoDB connection
    while (!global.mongooseConnected) {
      await new Promise(resolve => setTimeout(resolve, 100));

    }
    
    console.log('Clearing database...');
    // deletes existing rows if present
    await Promise.all([
      Appointment.deleteMany({}),
      Slot.deleteMany({}),
      User.deleteMany({})
    ]);

    console.log('Creating test users...');
    // seed users for testing 
    const users = [
      { username: 'A1', password: bcrypt.hashSync('student1', 8), role: 'student' },
      { username: 'A2', password: bcrypt.hashSync('student2', 8), role: 'student' },
      { username: 'P1', password: bcrypt.hashSync('professor1', 8), role: 'professor' },
    ];
    await Promise.all(users.map(user => User.create(user)));
    console.log('Test setup complete!\n');
  }, 30000);

  // close connection once test is complete
  afterAll(async () => {
    
    await mongoose.connection.close();
    console.log('Connection closed successfully \n');
  });

  it('should complete the full user flow', async () => {
    console.log('Starting E2E Test Flow:');

    // 1. Student A1 authenticates
    console.log('Step 1: Student A1 Login');
    let res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'A1', password: 'student1' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    studentA1Token = res.body.token;
    console.log('Student A1 logged in successfully');

    // 2. Professor P1 authenticates
    console.log('\n Step 2: Professor P1 Login');
    res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'P1', password: 'professor1' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    professorP1Token = res.body.token;
    console.log('Professor P1 logged in successfully');

    // 3. Professor P1 specifies available slots
    console.log('\n Step 3: Professor Creates Slots');
    res = await request(app)
      .post('/api/professors/P1/slots')
      .set('authorization', `Bearer ${professorP1Token}`)
      .send({ slots: [{ time: T1 }, { time: T2 }] });
    expect(res.status).toBe(201);
    console.log(' Professor created slots successfully');

    // 4. Student A1 views available slots
    console.log('\n Step 4: Student Views Slots');
    res = await request(app)
      .get('/api/professors/P1/slots')
      .set('authorization', `Bearer ${studentA1Token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { professor: 'P1', time: T1 },
      { professor: 'P1', time: T2 }
    ]);
    console.log(' Student viewed available slots successfully');

    // 5. Student A1 books an appointment
    console.log('\n Step 5: Student A1 Books Appointment');
    res = await request(app)
      .post('/api/appointments')
      .set('authorization', `Bearer ${studentA1Token}`)
      .send({ professor: 'P1', time: T1 });
    expect(res.status).toBe(201);
    console.log(' Student A1 booked appointment successfully');

    // 6. Student A2 authenticates
    console.log('\n Step 6: Student A2 Login');
    res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'A2', password: 'student2' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    studentA2Token = res.body.token;
    console.log(' Student A2 logged in successfully');

    // 7. Student A2 books an appointment
    console.log('\n Step 7: Student A2 Books Appointment');
    res = await request(app)
      .post('/api/appointments')
      .set('authorization', `Bearer ${studentA2Token}`)
      .send({ professor: 'P1', time: T2 });
    expect(res.status).toBe(201);
    console.log(' Student A2 booked appointment successfully');

    // 8. Professor cancels appointment
    console.log('\n Step 8: Professor Cancels Appointment');
    res = await request(app)
      .delete('/api/appointments')
      .set('authorization', `Bearer ${professorP1Token}`)
      .send({ student: 'A1', time: T1 });
    expect(res.status).toBe(200);
    console.log(' Professor cancelled appointment successfully');

    // 9. Student checks appointments
    console.log('\n Step 9: Student Checks Appointments');
    res = await request(app)
      .get('/api/appointments')
      .set('authorization', `Bearer ${studentA1Token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    console.log(' Student checked appointments successfully');

    console.log('\n All tests passed successfully!\n');
  }, 30000);
}); 