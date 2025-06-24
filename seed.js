require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

async function seedUsers() {
  await connectDB();
  const users = [
    { username: 'A1', password: bcrypt.hashSync('student1', 8), role: 'student' },
    { username: 'A2', password: bcrypt.hashSync('student2', 8), role: 'student' },
    { username: 'P1', password: bcrypt.hashSync('professor1', 8), role: 'professor' },
  ];
  for (const u of users) {
    const exists = await User.findOne({ username: u.username });
    if (!exists) {
      await User.create(u);
      console.log(`User ${u.username} seeded.`);
    } else {
      console.log(`User ${u.username} already exists.`);
    }
  }
  mongoose.connection.close();
}

seedUsers().catch(err => {
  console.error('Seeding error:', err);
  mongoose.connection.close();
}); 