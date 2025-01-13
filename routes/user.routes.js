const express = require('express');
const {
  registerUser,
  loginUser,
  getTrainAvailability,
  bookSeat,
  getBookingDetails,
  getSpecificBookingDetails
} = require('../controllers/user.controller');
const authenticateUser = require('../middlewares/authenticateUser');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/trains', getTrainAvailability);
router.post('/book', authenticateUser, bookSeat);
router.get('/bookings', authenticateUser, getBookingDetails);
router.get('/bookings/:booking_id', authenticateUser, getSpecificBookingDetails);

module.exports = router;
