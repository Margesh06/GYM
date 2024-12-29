const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const sequelize = require('./config/db');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/students', authRoutes);
app.use('/api/payments', paymentRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
