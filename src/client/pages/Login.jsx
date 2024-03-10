import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    try {
      const response = await axios.post('/api/login', { username, password }, config);
      // Assuming the token is returned in the response body under a property named "token"
      localStorage.setItem('token', response.data.token); // Store the token
      navigate('/dashboard'); // Navigate to Dashboard upon successful login
    } catch (error) {
      console.error('Login failed:', error);
      // Optionally clear token on failure for safety
      localStorage.removeItem('token');
    }
  };

  return (
    <div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
