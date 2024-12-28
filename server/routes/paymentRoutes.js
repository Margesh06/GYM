const express = require('express');
const { createPayment, getUserPayments, getAllUsersPayments } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/payment', authMiddleware, createPayment);

router.get('/payments', authMiddleware, getUserPayments);

router.get('/allusers', authMiddleware, getAllUsersPayments);

module.exports = router;
