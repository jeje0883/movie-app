import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode'; 


const Login = () => {
    const navigate = useNavigate();

    const { user, login } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('false');
    const [error, setError] = useState(null);

    useEffect(() => {
      if (user) {
        try {
          const decoded = jwtDecode(user);
          console.log(`decoded: ${JSON.stringify(decoded)}`);
          // setUserEmail(decoded.email);
        } catch (err) {
          setError('Invalid token. Please log in again.');
        }
      }
    }, [user]);

    useEffect(() =>{
       if(user){
          navigate('/movies');
       }
    },[user])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res =  await fetch( `https://movieapp-api-lms1.onrender.com/users/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ email, password }),
            });

            //response is not okay
            if (!res.ok){
                const error = await res.json();
                throw new Error(error.message);
            }

            //response is okay
            const data = await res.json();
            console.log(`logindata: ${data.access}`);
            login(data);

        } catch (err) {
            setError(err.message)
        }
    }


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
            {/* <button type="submit" className="button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button> */}
            <button type="submit" className="button">Login</button>
          </form>
          <p>
            Don't have an account? <Link to="/register" className="link">Register here.</Link>
          </p>
        </div>
      );
}

export default Login;
