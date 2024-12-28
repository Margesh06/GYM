import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const navigateToProfile = () => {
    navigate('/profile');
  };

  const navigateToDues = () => {
    navigate('/dues');
  };

  const navigateToHome = () => {
    navigate('/dashboard'); 
  };

  return (
    <nav style={styles.navBar}>
      <ul style={styles.navList}>
        <li style={styles.navItem} onClick={navigateToHome}>Home</li>
        <li style={styles.navItem} onClick={navigateToProfile}>Profile</li>
        <li style={styles.navItem} onClick={navigateToDues}>Dues</li>
        <li style={styles.navItem} onClick={onLogout}>Logout</li>
      </ul>
    </nav>
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
};

export default Navbar;
