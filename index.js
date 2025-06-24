require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Connect to database
connectDB();

app.use(bodyParser.json());

global.mongooseConnected = false;

mongoose.connection.once('open', () => {
  console.log('Database connection open.');
  global.mongooseConnected = true;
});

// Use Routes
app.use('/api/auth', authRoutes); 
app.use('/api', slotRoutes); 
app.use('/api', appointmentRoutes); 

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; 