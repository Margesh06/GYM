
# Gym Registration System

This project is a Gym Class Registration System built with React for the frontend and PostgreSQL for the backend. It allows students to register, make monthly payments, and manage their batch registrations.

---

## Features

### Functional Features
- Students can register for a gym batch.
- Monthly fees must be paid in advance.
- Students can select only one batch per month.
- Batch change requests can only be made the following month.
- Identify unpaid fees for the current or past months (Bonus).
- Calculate total outstanding dues for each student (Bonus).

### Technical Features
- Backend REST API implemented using Node.js and Sequelize.
- Frontend built with React, styled with CSS.
- PostgreSQL database for storing data.

---

## Prerequisites
- Node.js (v14 or above)
- PostgreSQL (v13 or above)
- npm (v7 or above)

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/gym-registration-system.git
   cd gym-registration-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Database**
   - Create a PostgreSQL database named `gym`.
   - Configure the database connection in `server/config/db.js`.

   Example:
   ```javascript
   const Sequelize = require('sequelize');

   const sequelize = new Sequelize('gym_registration', 'username', 'password', {
       host: 'localhost',
       dialect: 'postgres',
   });

   module.exports = sequelize;
   ```

4. **Run Migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the Backend Server**
   ```bash
   npm run start:server
   ```

6. **Start the Frontend Development Server**
   ```bash
   npm run start:frontend
   ```

---

## API Endpoints

### Authentication
- **POST /register:** Register a new user.
- **POST /login:** Login to the system.

### Payments
- **POST /payment:** Make a payment.
- **GET /payments:** Retrieve user-specific payment history.
- **GET /allusers:** Retrieve payment history for all users.

### User Details
- **GET /details:** Retrieve user details.

---


## Database Schema
![image](https://github.com/user-attachments/assets/bd42577e-2559-47f0-816e-3de3985f2631)

