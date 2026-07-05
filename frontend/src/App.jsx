import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';

/* 
 * =========================================================================
 * IMPLEMENTACIÓN DEL CLIENTE WEB (CONSUMO DE API REST) - RUTAS RELATIVAS
 * =========================================================================
 * Esta SPA (Single Page Application) consume la API REST del backend
 * utilizando rutas relativas, permitiendo que Nginx actúe como proxy.
 *
 * Ejemplos de endpoints consumidos a través de nuestros servicios:
 * 
 * fetch('/api/health')
 * 
 * fetch('/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password })
 * })
 * 
 * fetch('/api/wishlists')
 * 
 * fetch('/api/wishlists', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify(payload)
 * })
 * 
 * fetch(`/api/wishlists/${id}`, {
 *   method: 'PUT',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify(payload)
 * })
 * 
 * fetch(`/api/wishlists/${id}`, {
 *   method: 'DELETE',
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * })
 * =========================================================================
 */


import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WishlistDetail from './pages/WishlistDetail';
import Friends from './pages/Friends';
import Notifications from './pages/Notifications';
// import MyWishlists from './pages/MyWishlists';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/wishlists/:id" element={<ProtectedRoute><WishlistDetail /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          {/* <Route path="/my-wishlists" element={<ProtectedRoute><MyWishlists /></ProtectedRoute>} /> */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
