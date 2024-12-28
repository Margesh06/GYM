const { User } = require('../models/user');
const { Admin } = require('../models/admin');
const { generateToken } = require('../config/jwt');

// Login functionality
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (admin && admin.password === password) {
      const token = generateToken(admin.id);
      return res.json({ token, role: 'admin' });
    }

    const user = await User.findOne({ where: { email } });
    if (user && user.password === password) {
      const token = generateToken(user.id);
      return res.json({ token, role: 'user' });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Register functionality for both User and Admin
const register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    if (isAdmin) {
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      const newAdmin = await Admin.create({ name, email, password });
      const token = generateToken(newAdmin.id);
      res.status(201).json({ token, role: 'admin' });
    } else {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = await User.create({ name, email, password });
      const token = generateToken(newUser.id);
      res.status(201).json({ token, role: 'user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error registering user or admin' });
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.user.id; 
  
  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email'], 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
};


module.exports = { login, register, getUserDetails };
