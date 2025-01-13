const { Train, AdminApiKey, User } = require('../models/main');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();



const validateAdminApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ message: 'Admin API Key is required' });
  }

  const adminKey = await AdminApiKey.findOne({ where: { api_key: apiKey } });
  if (!adminKey) {
    return res.status(403).json({ message: 'Invalid Admin API Key' });
  }
  next();
};


const registerAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log(req.body);

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await User.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      username,
      password: hashedPassword,
      email,
      role: 'admin',
    });

    
    const apiKey = `admin-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
    await AdminApiKey.create({ api_key: apiKey, admin_id: admin.user_id });

    res.status(201).json({ message: 'Admin registered successfully', admin, apiKey });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const admin = await User.findOne({ where: { username, role: 'admin' } });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: admin.user_id, role: admin.role },process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const addTrain = async (req, res) => {
  try {
    const { train_name, source_station, destination_station, total_seats } = req.body;
    console.log(req.body);

    if (!train_name || !source_station || !destination_station || !total_seats) {
      return res.status(400).json({ message: 'All train details are required' });
    }

    const train = await Train.create({
      train_name,
      source_station,
      destination_station,
      total_seats,
      available_seats: total_seats,
    });

    res.status(201).json({ message: 'Train added successfully', train });
  } catch (error) {
    console.error('Error adding train:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateTrain = async (req, res) => {
  try {
    const { train_id } = req.params;
    const { total_seats } = req.body;

    if (!total_seats) {
      return res.status(400).json({ message: 'Total seats are required for update' });
    }

    const train = await Train.findByPk(train_id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    train.total_seats = total_seats;
    train.available_seats = total_seats; 
    await train.save();

    res.status(200).json({ message: 'Train updated successfully', train });
  } catch (error) {
    console.error('Error updating train:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const deleteTrain = async (req, res) => {
  try {
    const { train_id } = req.params;

    const train = await Train.findByPk(train_id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    await train.destroy();
    res.status(200).json({ message: 'Train deleted successfully' });
  } catch (error) {
    console.error('Error deleting train:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  validateAdminApiKey,
  addTrain,
  updateTrain,
  deleteTrain,
  registerAdmin,
  loginAdmin
};
