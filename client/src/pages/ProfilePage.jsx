import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ProfilePage = () => {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (!user) {
      
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/details', {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        });
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user, navigate]);

  const navigateToDashboard = () => {
    navigate('/user-dashboard');
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!userDetails) {
    return <div>Loading...</div>; 
  }

  return (
    
    <div style={styles.profileContainer}>
    <Navbar onLogout={handleLogout} />
      <h2>Profile</h2>
      
      <div style={styles.infoSection}>
        <h3>User Information</h3>
        <p><strong>Name:</strong> {userDetails.name || 'Not Available'}</p>
        <p><strong>Email:</strong> {userDetails.email || 'Not Available'}</p>
      </div>
    </div>
  );
};

const styles = {
  profileContainer: {
    padding: '20px',
    //maxWidth: '800px',
   // margin: '0 auto',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  infoSection: {
    marginBottom: '20px',
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

export default ProfilePage;
