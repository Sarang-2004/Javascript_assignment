const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).send('Enter all fields');

    }
    const normalizedRole = role.toLowerCase();
    if (!['student', 'professor'].includes(normalizedRole)) {
      return res.status(400).send('Role must be student or professor');
    }
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).send('Username is already taken');

    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'User not Registered', error: error.message });

  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });

  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

module.exports = {
  register,
  login,
}; 