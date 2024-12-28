require('dotenv').config();
const { Sequelize } = require('sequelize');


// Setup the database connection using Sequelize
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres', // Specify the database dialect, e.g., 'postgres', 'mysql', 'sqlite', etc.
  logging: false, // Optional: Disable logging to avoid console clutter
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
