import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('false');
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res =  await fetch( `https://movieapp-api-lms1.onrender.com/users/register`, {
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
            console.log(`Registration Res: ${JSON.stringify(data)}`);

        } catch (err) {
            setError(err.message)
        }
    }


    return (
        <div className="container">
          <h2>Register</h2>
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
            <button type="submit" className="button">Register
            </button>
          </form>
          <p>
            Already have an account? <Link to="/login" className="link">Login.</Link>
          </p>
        </div>
      );
}

export default Login;
