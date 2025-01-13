const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/main');
dotenv.config();

const authenticateUser =async (req, res, next) => {
  let token = req.headers['authorization'];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  if(token.startsWith('Bearer ')){
    token=token.slice(7,token.length)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findOne({ where: { user_id: decoded.userId } });
    if (!user||user.role!=='user') {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token, User not authorized' });
  }
};

module.exports = authenticateUser;
