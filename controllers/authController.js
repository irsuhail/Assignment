const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'No refresh token provided' });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const accessToken = generateAccessToken(decoded.userId);
    res.status(200).json({ accessToken });
  });
};

module.exports = { signup, login, refreshToken };