import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [edad, setEdad] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      await register({
        username,
        email,
        password,
        nombres,
        apellidos,
        edad: edad ? parseInt(edad, 10) : undefined
      });
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        // Mostrar el primer error de validación del backend si existe
        setError(err.response.data.errors[0].message);
      } else {
        setError(err.response?.data?.message || 'Error al registrar. Intenta de nuevo.');
      }
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
          <h1 className="auth-title">Únete a<br/>Giftly.</h1>
          <p className="auth-subtitle">Crea tu cuenta y empieza a armar tus listas.</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>NOMBRES</label>
                <input 
                  type="text" 
                  value={nombres} 
                  onChange={(e) => setNombres(e.target.value)} 
                  placeholder="Ej. Juan"
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>APELLIDOS</label>
                <input 
                  type="text" 
                  value={apellidos} 
                  onChange={(e) => setApellidos(e.target.value)} 
                  placeholder="Ej. Pérez"
                />
              </div>
            </div>

            <div className="form-group">
              <label>EDAD (Opcional)</label>
              <input 
                type="number" 
                value={edad} 
                onChange={(e) => setEdad(e.target.value)} 
                placeholder="Ej. 25"
                min="13"
                max="120"
              />
            </div>

            <div className="form-group">
              <label>NOMBRE DE USUARIO</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="juanperez123"
                required 
              />
            </div>
            
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
                placeholder="Mínimo 6 caracteres"
                required 
              />
            </div>
            
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'CREANDO...' : 'CREAR CUENTA'}
            </button>
          </form>
          
          <div className="auth-footer">
            <span>¿Ya tienes una cuenta?</span>
            <Link to="/login" className="auth-link">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
