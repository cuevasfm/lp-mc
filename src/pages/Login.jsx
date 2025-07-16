import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // La redirección se maneja en el useEffect
    } catch (err) {
      setError(err.message || 'Error en el inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1rem',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>
            Iniciar Sesión
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '1rem',
            margin: '0'
          }}>
            Accede al panel de administración
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#f87171',
              fontSize: '0.875rem',
              margin: '0'
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#ffffff',
              margin: '0',
              padding: '0'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="tu@email.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                opacity: loading ? '0.6' : '1',
                cursor: loading ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => !loading && (e.target.style.border = '2px solid #10b981')}
              onBlur={(e) => e.target.style.border = '1px solid #374151'}
            />
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#ffffff',
              margin: '0',
              padding: '0'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                opacity: loading ? '0.6' : '1',
                cursor: loading ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => !loading && (e.target.style.border = '2px solid #10b981')}
              onBlur={(e) => e.target.style.border = '1px solid #374151'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              backgroundColor: loading ? '#047857' : '#059669',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? '0.8' : '1',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#047857')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Footer */}
       {/*  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.875rem',
            margin: '0'
          }}>
            ¿No tienes cuenta?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{
                color: '#10b981',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.target.style.color = '#34d399'}
              onMouseLeave={(e) => e.target.style.color = '#10b981'}
            >
              Regístrate aquí
            </span>
          </p>
        </div> */}

      </div>

      {/* CSS Animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Login;