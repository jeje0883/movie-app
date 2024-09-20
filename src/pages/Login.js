import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode'; 


const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      if (user) {
          navigate('/movies');
      }

      // console.log(user);
  }, [user, navigate]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const res = await fetch(`https://movieapp-api-lms1.onrender.com/users/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
              const error = await res.json();
              throw new Error(error.message);
          }

          const data = await res.json();
          login(data.access); 
          console.log(`token login: ${data.access}`)// Store token in localStorage via context
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  return (
      <div className="container">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="form">
              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
              />
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
              />
              <button type="submit" className="button" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
              </button>
          </form>
          <p>
              Don't have an account? <Link to="/register" className="link">Register here.</Link>
          </p>
      </div>
  );
};

export default Login;

