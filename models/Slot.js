const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model('Slot', slotSchema); 