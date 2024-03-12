import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const useAuthRequest = () => {
  const baseAxios = axios.create();
  const navigate = useNavigate();

  const buildRequestConfig = () => {
    const authToken = localStorage.getItem('token');

    if (!authToken) {
      console.error('No token available');
      navigate('/login', { replace: true });
      return null;
    }

    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      }
    };
  };

  const makeRequest = async (endpoint, method) => {
    const config = buildRequestConfig();
    if (!config) throw new Error('Unauthorized');

    try {
      return await baseAxios[method](endpoint, config);
    } catch (err) {
      console.error('Request failed:', err);
      alert(err.message);
    }
  };

  const postRequest = async (endpoint, payload) => {
    const config = buildRequestConfig();
    if (!config) throw new Error('Unauthorized');

    if (!payload) return new Error('Invalid data');

    // Use DOMPurify to sanitize user's input at FE
    const purifiedPayload = DOMPurify.sanitize(payload);

    try {
      return await baseAxios.post(endpoint, { data: purifiedPayload }, config);
    } catch (err) {
      console.error('POST request failed:', err);
      alert(err.message);
    }
  };

  return { makeRequest, postRequest };
};

export default useAuthRequest;
