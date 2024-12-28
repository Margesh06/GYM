import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage'; // Add PaymentPage
import DuesPage from './pages/DuesPage'; // Import DuesPage
import { useAuthContext } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} /> : <RegisterPage />} 
        />

        {/* User Routes */}
        <Route 
          path="/user-dashboard" 
          element={user?.role === 'user' ? <UserDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/subscribe/payment" 
          element={user?.role === 'user' ? <PaymentPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dues" 
          element={user?.role === 'user' ? <DuesPage /> : <Navigate to="/login" />}  // Add route for DuesPage
        />
        <Route 
          path="/profile" 
          element={user ? <ProfilePage /> : <Navigate to="/login" />} // Add route for ProfilePage
        />

        {/* Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />

        {/* Default Route */}
        <Route 
          path="/" 
          element={<Navigate to={user ? (user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard') : '/login'} />} 
        />

        {/* Fallback for Unknown Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
