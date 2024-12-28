require('dotenv').config();
const { Sequelize } = require('sequelize');


// Setup the database connection using Sequelize
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres', 
  logging: false, 
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
