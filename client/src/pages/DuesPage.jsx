import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const DuesPage = () => {
  const { logout, user } = useAuthContext(); // Use context to get the logged-in user
  const navigate = useNavigate();
  const [userPayments, setUserPayments] = useState([]);
  const [dues, setDues] = useState(false);
  const [dueAmount, setDueAmount] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  // Fetch payments for the logged-in user
  const fetchUserPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/payments', {
        headers: {
          Authorization: `Bearer ${user?.token}`, // Use token from context
        },
      });

      const payments = response.data.payments || [];
      setUserPayments(payments); // Ensure payments is always an array

      if (payments.length > 0) {
        // Extract the remainingDays and dues information directly from the backend response
        setDues(response.data.dues || false);
        setDueAmount(response.data.payments[0]?.amount || 0); // Assuming the due amount is the same as the last payment amount
        setDaysLeft(response.data.remainingDays || 0); // Use the remaining days from the backend response
      } else {
        setDues(false);
      }
    } catch (error) {
      console.error('Error fetching user payments:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPayments();
    }
  }, [user]);

  const navigateToDashboard = () => {
    navigate('/user-dashboard');
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
    <Navbar onLogout={handleLogout} />
      <h3 style={styles.header}>Your Payments</h3>

      {/* Dues Section */}
      {dues ? (
        <div style={styles.duesContainer}>
          <p style={styles.duesText}>You have dues of INR {dueAmount}. Please make a payment.</p>
          <p style={styles.duesText}>Days left to pay your due: {daysLeft} days</p>
        </div>
      ) : (
        <p style={styles.noDuesText}>No dues. You are up to date with your payments.</p>
      )}

      {/* Payments List */}
      <h4 style={styles.subHeader}>Recent Payments</h4>
      <ul style={styles.paymentList}>
        {userPayments.length === 0 ? (
          <li>No payments found</li>
        ) : (
          userPayments.map((payment) => (
            <li key={payment.id} style={styles.paymentItem}>
              Plan: {payment.planType}, Amount: INR {payment.amount}, Date: {new Date(payment.createdAt).toLocaleDateString()}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
    marginBottom: '20px',
  },
  subHeader: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '15px',
  },
  duesContainer: {
    backgroundColor: '#ffdddd',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  duesText: {
    color: '#d9534f',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  noDuesText: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: '#5bc0de',
    textAlign: 'center',
    marginBottom: '20px',
  },
  paymentList: {
    listStyleType: 'none',
    padding: 0,
  },
  paymentItem: {
    backgroundColor: '#fff',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default DuesPage;
