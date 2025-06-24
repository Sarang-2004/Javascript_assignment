const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const authenticate = require('../middleware/auth');

router.post('/professors/:profId/slots', authenticate, slotController.createSlots);
router.get('/professors/:profId/slots', authenticate, slotController.getAvailableSlots);

module.exports = router; 