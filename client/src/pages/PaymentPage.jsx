

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext'; 

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext(); 
  const [paymentStatus, setPaymentStatus] = useState('');
  const { planType, amount } = state || {};


  const handlePayment = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/payments/payment',
        { planType, amount },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, 
          },
        }
      );
      if (response.status === 201) {
        setPaymentStatus('Payment successful!');
        navigate('/dashboard');
      } else {
        setPaymentStatus('Payment failed, please try again.');
      }
    } catch (error) {
      setPaymentStatus('Error processing payment.');
    }
  };

  useEffect(() => {
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Payment Page</h2>
      <div style={styles.card}>
        <p style={styles.planText}>Plan: <span style={styles.planDetails}>{planType}</span></p>
        <p style={styles.amountText}>Amount: <span style={styles.amountDetails}>${amount}</span></p>
        <p style={styles.dueDateText}>Due Date: <span style={styles.dueDateDetails}>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span></p>

        <button
          onClick={handlePayment}
          style={styles.button}
          disabled={!user}
        >
          Make Payment
        </button>
        {paymentStatus && <p style={styles.statusMessage}>{paymentStatus}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    backgroundColor: '#f4f7fc',
    minHeight: '100vh',
  },
  header: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  planText: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '10px 0',
  },
  planDetails: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  amountText: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '10px 0',
  },
  amountDetails: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  dueDateText: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '10px 0',
  },
  dueDateDetails: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    marginTop: '20px',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  statusMessage: {
    marginTop: '20px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#FF5722',
  },
};

export default PaymentPage;
