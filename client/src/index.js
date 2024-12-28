import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import path for ReactDOM
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));  // createRoot instead of render
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
