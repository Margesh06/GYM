const express = require('express');
const { createPayment, getUserPayments, getAllUsersPayments } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /payment
router.post('/payment', authMiddleware, createPayment);

// GET /payments (User-specific)
router.get('/payments', authMiddleware, getUserPayments);

router.get('/allusers', authMiddleware, getAllUsersPayments);

module.exports = router;
