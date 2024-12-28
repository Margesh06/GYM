const express = require('express');
const { login, register, getUserDetails } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /login
router.post('/login', login);

// POST /register
router.post('/register', register);

router.get('/details',authMiddleware,getUserDetails)

module.exports = router;
