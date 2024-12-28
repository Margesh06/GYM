import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/students/register', {
        name,
        email,
        password,
      });
      alert('Registration Successful');
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed, please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Register</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>Register</button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{' '}
          <button onClick={handleLoginRedirect} style={styles.loginButton}>
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

// Styling Object
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f6f9',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  header: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  submitButton: {
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  submitButtonHover: {
    backgroundColor: '#218838',
  },
  loginText: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#555',
  },
  loginButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default RegisterPage;
