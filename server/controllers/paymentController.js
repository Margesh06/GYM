const { Payment } = require('../models/payment');
const { User } = require('../models/user');


const createPayment = async (req, res) => {
  const { planType, amount } = req.body;
  const userId = req.user.id; 

  try {
    const payment = await Payment.create({ userId, planType, amount });
    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    console.error(error);  
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};


const getUserPayments = async (req, res) => {
  const userId = req.user.id; 

  try {
    const payments = await Payment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],  
    });

    if (payments.length === 0) {
      return res.status(200).json({
        payments: [],
        dues: false,
        remainingDays: 0,
      });
    }

    const lastPayment = payments[0];
    const lastPaymentDate = new Date(lastPayment.createdAt);
    const currentDate = new Date();
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
    const payments = await Payment.findAll({
      attributes: ['userId', 'createdAt'], 
      order: [['createdAt', 'DESC']], 
    });

    const userIds = [...new Set(payments.map(payment => payment.userId))]; 

    const users = await User.findAll({
      where: {
        id: userIds,
      },
      attributes: ['id', 'name', 'email'], 
    });

    const usersMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const userPayments = await Promise.all(userIds.map(async (userId) => {
      const payment = await Payment.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']], 
      });

      if (!payment) return null; 

      const user = usersMap[userId]; 
      if (!user) return null; 

      const lastPaymentDate = new Date(payment.createdAt);
      const currentDate = new Date();

      const diffTime = Math.abs(currentDate - lastPaymentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const hasDues = diffDays > 30;

      const remainingDays = 5 - (diffDays - 30);

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        dues: hasDues,
        remainingDays,
      };
    }));

    const usersWithDues = userPayments.filter(item => item !== null);

    res.json({ usersWithDues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payments for users', error: error.message });
  }
};




module.exports = { createPayment, getUserPayments, getAllUsersPayments };
