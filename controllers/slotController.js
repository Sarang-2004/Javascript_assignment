const User = require('../models/User');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');

const createSlots = async (req, res) => {
  try {
    if (req.user.role !== 'professor' || req.user.username !== req.params.profId) {
      return res.status(403).send('Forbidden');
    }
    const prof = await User.findOne({ username: req.params.profId, role: 'professor' });
    if (!prof) return res.status(404).send('Professor not found');

    await Slot.deleteMany({ professor: prof._id });
    const newSlots = req.body.slots.map(slot => ({ professor: prof._id, time: slot.time }));
    await Slot.insertMany(newSlots);

    res.status(201).send('Slots created successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error creating slots', error: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const prof = await User.findOne({ username: req.params.profId, role: 'professor' });
    if (!prof) return res.status(404).send('Professor not found');

    const profSlots = await Slot.find({ professor: prof._id });
    const booked = await Appointment.find({ professor: prof._id });
    const bookedTimes = booked.map(a => a.time);
    const available = profSlots
      .filter(s => !bookedTimes.includes(s.time))
      .map(s => ({ professor: req.params.profId, time: s.time }));

    res.json(available);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available slots', error: error.message });
  }
};

module.exports = {
  createSlots,
  getAvailableSlots,
}; 