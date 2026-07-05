import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="bg-shape shape-1">🎁</div>
        <div className="bg-shape shape-2">✨</div>
        <div className="bg-shape shape-3">🎉</div>
        <div className="bg-shape shape-4">🛍️</div>
        <div className="bg-shape shape-5">💝</div>
        <div className="bg-shape shape-6">🎀</div>
        <div className="bg-shape shape-7">🎈</div>
        <div className="bg-shape shape-8">🎊</div>
      </div>

      <nav className="auth-nav">
        <Link to="/" className="nav-logo uppercase">GIFTLY</Link>
      </nav>
      
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Bienvenido<br/>de nuevo.</h1>
          <p className="auth-subtitle">Entra para gestionar tus listas de deseos.</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>CORREO ELECTRÓNICO</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="tu@email.com"
                required 
              />
            </div>
            
            <div className="form-group">
              <label>CONTRASEÑA</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
            
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>
          
          <div className="auth-footer">
            <span>¿No tienes una cuenta?</span>
            <Link to="/register" className="auth-link">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
