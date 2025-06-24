const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middleware/auth');

router.post('/appointments', authenticate, appointmentController.bookAppointment);
router.delete('/appointments', authenticate, appointmentController.cancelAppointment);
router.get('/appointments', authenticate, appointmentController.getAppointments);

module.exports = router; 