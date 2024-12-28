import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { logout, user } = useAuthContext(); 
  const [usersWithDues, setUsersWithDues] = useState([]); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  useEffect(() => {
    const fetchUsersWithDues = async () => {
      try {

        const token = user?.token;
        if (!token) {
          console.error('No token found. Please log in again.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/payments/allusers', {
          headers: {
            Authorization: `Bearer ${token}`, // Include Authorization header
          },
        });

        setUsersWithDues(response.data.usersWithDues);
        console.log(response);
      } catch (error) {
        console.error('Error fetching users payment data:', error);
        if (error.response && error.response.status === 403) {
          console.error('Access denied. Please ensure you have the correct permissions.');
        }
      }
    };

    if (user) {
      fetchUsersWithDues();
    }
  }, [user]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Dashboard</h2>
      <p style={styles.subHeader}>Welcome, Admin! Here you can manage everything.</p>

      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>

      <h3 style={styles.tableHeader}>Users Payment Dues</h3>
      {usersWithDues.length > 0 ? (
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableCell}>User Name</th>
              <th style={styles.tableCell}>Email</th>
              <th style={styles.tableCell}>Dues Status</th>
              <th style={styles.tableCell}>Remaining Days</th>
            </tr>
          </thead>
          <tbody>
            {usersWithDues.map((user, index) => (
              <tr key={index} style={styles.tableRow}>
                <td style={styles.tableCell}>{user.userName}</td>
                <td style={styles.tableCell}>{user.userEmail}</td>
                <td style={styles.tableCell}>{user.dues ? 'Has Dues' : 'No Dues'}</td>
                <td style={styles.tableCell}>{user.remainingDays} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No dues found or unable to fetch data.</p>
      )}
    </div>
  );
};

// Styling Object
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f4f6f9',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '1000px',
    margin: '30px auto',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    fontSize: '36px',
    marginBottom: '10px',
  },
  subHeader: {
    textAlign: 'center',
    color: '#555',
    fontSize: '18px',
    marginBottom: '30px',
  },
  logoutButton: {
    backgroundColor: '#FF6F61',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'block',
    margin: '20px auto',
    transition: 'background-color 0.3s',
  },
  logoutButtonHover: {
    backgroundColor: '#d9534f',
  },
  tableHeader: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
  },
  tableHead: {
    backgroundColor: '#f8f9fa',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'center',
    color: '#555',
    borderBottom: '1px solid #ddd',
  },
};

export default AdminDashboard;
