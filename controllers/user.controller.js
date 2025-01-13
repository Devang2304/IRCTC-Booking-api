const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Train, Booking, sequelize } = require('../models/main');


const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role: 'user',
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getTrainAvailability = async (req, res) => {
  try {
    const { source_station, destination_station } = req.query;

    if (!source_station || !destination_station) {
      return res.status(400).json({ message: 'Source and destination are required' });
    }

    const trains = await Train.findAll({
      where: {
        source_station,
        destination_station,
      },
    });

    res.status(200).json({ trains });
  } catch (error) {
    console.error('Error fetching train availability:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const bookSeat = async (req, res) => {
    const transaction = await sequelize.transaction(); 
    try {
      const { train_id, seats_booked } = req.body;

      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      if (!train_id || !seats_booked) {
        return res.status(400).json({ message: 'Train ID and number of seats are required' });
      }
  
      
      const train = await Train.findOne({
        where: { train_id },
        lock: true, 
        transaction, 
      });
  
      if (!train) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Train not found' });
      }
  
      
      if (train.available_seats < seats_booked) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Not enough seats available' });
      }
  
      
      train.available_seats -= seats_booked;
      await train.save({ transaction });
  
      const booking = await Booking.create(
        {
          user_id: userId,
          train_id,
          seats_booked,
          booking_status: 'confirmed',
        },
        { transaction }
      );
  
      await transaction.commit(); 
      res.status(200).json({ message: 'Booking successful', booking });
    } catch (error) {
      await transaction.rollback(); 
      console.error('Error booking seat:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


const getBookingDetails = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [{ model: Train, attributes: ['train_name', 'source_station', 'destination_station'] }],
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSpecificBookingDetails = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const booking = await Booking.findOne({
      where: { booking_id: booking_id },
      include: [{ model: Train, attributes: ['train_name', 'source_station', 'destination_station'] }],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error('Error fetching specific booking details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getTrainAvailability,
  bookSeat,
  getBookingDetails,
  getSpecificBookingDetails
};
