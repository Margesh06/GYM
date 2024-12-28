const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const sequelize = require('./config/db');

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/students', authRoutes);
app.use('/api/payments', paymentRoutes);

// Sync the models with the database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
