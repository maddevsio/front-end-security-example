import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthRequest from '../request/useAuthRequest';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { postRequest } = useAuthRequest();

  const handleLogin = async () => {
    try {
      const response = await postRequest('/api/login', { username, password });
      if (response.status !== 200) throw new Error();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="button" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
