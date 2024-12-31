import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import Navbar from './Navbar';

const UserDashboard = () => {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();
  const [userPayments, setUserPayments] = useState([]);
  const [canSubscribe, setCanSubscribe] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/details', {
          headers: {
            Authorization: `Bearer ${user?.token}`, 
          },
        });
        setUserName(response.data.name || 'User');
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchUserPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments/payments', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const payments = response.data.payments || [];
        setUserPayments(payments);

        if (payments.length > 0) {
          const lastPayment = payments[0];  
          const lastPaymentDate = new Date(lastPayment.createdAt);
          const currentDate = new Date();

          const diffTime = Math.abs(currentDate - lastPaymentDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          setCanSubscribe(diffDays > 30);
          setSubscriptionInfo({
            planType: lastPayment.planType,
            dueAmount: lastPayment.amount,
            remainingDays: 30 - diffDays, // Calculate how many days are remaining
          });
        } else {
          setCanSubscribe(true);
          setSubscriptionInfo(null); 
        }
      } catch (error) {
        console.error('Error fetching user payments:', error);
      }
    };

    if (user) {
      fetchUserDetails();
      fetchUserPayments();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateToPayment = (planType, amount) => {
    navigate(`/subscribe/payment`, { state: { planType, amount } });
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />

      <h2>Welcome, {userName}!</h2> 

      {subscriptionInfo && (
        <div>
          <p>Last subscription: {subscriptionInfo.planType} (INR {subscriptionInfo.dueAmount})</p>
          <p>{canSubscribe ? 'You can subscribe to a new plan now.' : `You need to wait ${subscriptionInfo.remainingDays} more days to subscribe again.`}</p>
        </div>
      )}

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>Morning Batch</h3>
          <p>INR 7000</p>
          <button
            style={styles.button}
            onClick={() => canSubscribe && navigateToPayment('Morning Batch', 7000)}
            disabled={!canSubscribe}
          >
            {canSubscribe
      ? 'Subscribe'
      : `Wait ${subscriptionInfo?.remainingDays || 30} Days`}
          </button>
        </div>

        <div style={styles.card}>
          <h3>Afternoon Batch</h3>
          <p>INR 7000</p>
          <button
            style={styles.button}
            onClick={() => canSubscribe && navigateToPayment('Afternoon Batch', 7000)}
            disabled={!canSubscribe}
          >
            {canSubscribe
      ? 'Subscribe'
      : `Wait ${subscriptionInfo?.remainingDays || 30} Days`}
          </button>
        </div>

        <div style={styles.card}>
          <h3>Evening Batch</h3>
          <p>INR 7000</p>
          <button
            style={styles.button}
            onClick={() => canSubscribe && navigateToPayment('Evening Batch', 7000)}
            disabled={!canSubscribe}
          >
            {canSubscribe
      ? 'Subscribe'
      : `Wait ${subscriptionInfo?.remainingDays || 30} Days`}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  navBar: {
    backgroundColor: '#333',
    padding: '10px 0',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },
  navItem: {
    color: '#fff',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default UserDashboard;
