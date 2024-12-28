const { Payment } = require('../models/payment');
const { User } = require('../models/user');

// Create payment entry
const createPayment = async (req, res) => {
  const { planType, amount } = req.body;
  const userId = req.user.id; // Extracted from auth middleware

  try {
    const payment = await Payment.create({ userId, planType, amount });
    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

// Get payments for the logged-in user
const getUserPayments = async (req, res) => {
  const userId = req.user.id; // Extracted from auth middleware

  try {
    // Fetch payments sorted by createdAt in descending order
    const payments = await Payment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],  // Sort by createdAt in descending order
    });

    if (payments.length === 0) {
      // If no payments, return an empty array and set dues flag to false
      return res.status(200).json({
        payments: [],
        dues: false,
        remainingDays: 0,
      });
    }

    // The most recent payment will now be the first item
    const lastPayment = payments[0];
    const lastPaymentDate = new Date(lastPayment.createdAt);
    const currentDate = new Date();

    // Calculate the difference in days
    const diffTime = Math.abs(currentDate - lastPaymentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


    // If the difference is more than 30 days, mark as dues
    const hasDues = diffDays > 30;

    // Calculate remaining days until the next payment (5 days to make payment)
    const remainingDays = 5 - (diffDays - 30);

    res.status(200).json({
      payments,
      dues: hasDues,  
      remainingDays,   
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};



const getAllUsersPayments = async (req, res) => {
  try {
    // Step 1: Fetch all payments for users with userId and their payment details, sorted by createdAt (DESC)
    const payments = await Payment.findAll({
      attributes: ['userId', 'createdAt'], // Only fetch userId and createdAt (to check the last payment date)
      order: [['createdAt', 'DESC']], // Sort payments by creation date (most recent first)
    });

    // Step 2: Get the unique userIds from the payments
    const userIds = [...new Set(payments.map(payment => payment.userId))]; // Unique userIds

    // Step 3: Fetch users for all the unique userIds
    const users = await User.findAll({
      where: {
        id: userIds,
      },
      attributes: ['id', 'name', 'email'], // User details
    });

    // Create a map of users for quick lookup by userId
    const usersMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // Step 4: Fetch the most recent payment for each user (most recent first)
    const userPayments = await Promise.all(userIds.map(async (userId) => {
      // Fetch the most recent payment for this user
      const payment = await Payment.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']], // Sort by createdAt (most recent first)
      });

      if (!payment) return null; // If no payment is found for this user, skip this user

      const user = usersMap[userId]; // Retrieve the user from the map
      if (!user) return null; // If no user is found, skip this payment

      const lastPaymentDate = new Date(payment.createdAt);
      const currentDate = new Date();

      // Calculate the difference in days between the current date and the last payment date
      const diffTime = Math.abs(currentDate - lastPaymentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Dues logic: if the last payment was more than 30 days ago, mark as dues
      const hasDues = diffDays > 30;

      // Calculate remaining days until the next payment (5 days to make payment)
      const remainingDays = 5 - (diffDays - 30);

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        dues: hasDues,
        remainingDays,
      };
    }));

    // Filter out any null values (users without payments or users without corresponding data)
    const usersWithDues = userPayments.filter(item => item !== null);

    // Step 5: Respond with the formatted data
    res.json({ usersWithDues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payments for users', error: error.message });
  }
};




module.exports = { createPayment, getUserPayments, getAllUsersPayments };
