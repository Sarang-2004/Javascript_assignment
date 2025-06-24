const User = require('../models/User');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');

const bookAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).send('Forbidden');

    const { professor, time } = req.body;
    const prof = await User.findOne({ username: professor, role: 'professor' });
    const student = await User.findOne({ username: req.user.username, role: 'student' });
    if (!prof || !student) return res.status(404).send('User not found');

    const slotExists = await Slot.findOne({ professor: prof._id, time });
    const alreadyBooked = await Appointment.findOne({ professor: prof._id, time });
    if (!slotExists || alreadyBooked) return res.status(400).send('Slot unavailable');

    await Appointment.create({ professor: prof._id, student: student._id, time });
    res.status(201).send('Appointment booked successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'professor') return res.status(403).send('Forbidden');

    const { student, time } = req.body;
    const prof = await User.findOne({ username: req.user.username, role: 'professor' });
    const stud = await User.findOne({ username: student, role: 'student' });
    if (!prof || !stud) return res.status(404).send('User not found');

    const result = await Appointment.deleteOne({ professor: prof._id, student: stud._id, time });
    if (result.deletedCount === 0) return res.status(404).send('Appointment not found');

    res.status(200).send('Appointment canceled successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error canceling appointment', error: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).send('Forbidden');

    const student = await User.findOne({ username: req.user.username, role: 'student' });
    if (!student) return res.status(404).send('User not found');

    const myAppointments = await Appointment.find({ student: student._id }).populate('professor', 'username').populate('student', 'username');
    res.json(myAppointments.map(a => ({
      professor: a.professor.username,
      student: a.student.username,
      time: a.time
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

module.exports = {
  bookAppointment,
  cancelAppointment,
  getAppointments,
}; 