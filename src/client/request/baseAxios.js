import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxios = () => {
  const baseAxios = axios.create();
  const navigate = useNavigate();

  async function refreshAuthToken() {
    try {
      const response = await axios.post('/api/refresh');
      if (response.status === 200 && response.data.authToken) {
        localStorage.setItem('authToken', response.data.authToken);
        return response.data.authToken;
      }

      // Failed to refresh
      localStorage.removeItem('authToken');
      navigate('/login', { replace: true });
      return null;
    } catch (error) {
      console.error('Error while refreshing token:', error);
      localStorage.removeItem('authToken');
      navigate('/login', { replace: true });
      return null;
    }
  }

  baseAxios.interceptors.request.use(
    (config) => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('No token available');
        navigate('/login', { replace: true });
        return null;
      }
      config.headers.Authorization = `Bearer ${authToken}`;
      return config;
    },
    error => Promise.reject(error)
  );


  baseAxios.interceptors.response.use(
    response => response,
    (errorAxiosInstance) => {
      // If the error response status is 401, try refreshing the token
      if (errorAxiosInstance.response && errorAxiosInstance.response.status === 401) {
        return refreshAuthToken().then((newAuthToken) => {
          if (!newAuthToken) {
            navigate('/login', { replace: true });
            throw new Error('Failed to refresh auth token');
          }

          // Retry the original request with the new token
          errorAxiosInstance.config.headers.Authorization = `Bearer ${newAuthToken}`;
          localStorage.setItem('authToken', newAuthToken);
          return axios(errorAxiosInstance.config);
        });
      }
      // For other errors, reject the promise
      return Promise.reject(errorAxiosInstance);
    }
  );

  return baseAxios;
};

export default useAxios;
