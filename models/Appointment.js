const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema); 