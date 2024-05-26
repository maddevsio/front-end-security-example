import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxios = () => {
  const baseAxios = axios.create({
    withCredentials: true,
  });
  const navigate = useNavigate();

  async function refreshAuthToken(originalRequest) {
    try {
      const response = await axios.post('/api/refresh');
      if (response.status === 200 && response.data.authToken) {
        // Retry the original request with the new token
        axios(originalRequest);
      }

      // Failed to refresh
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error while refreshing token:', error);
      navigate('/login', { replace: true });
    }
  }

  baseAxios.interceptors.response.use(
    response => response,
    (errorAxiosInstance) => {
      // If the error response status is 401, try refreshing the token
      if (errorAxiosInstance.response && errorAxiosInstance.response.status === 401) {
        return refreshAuthToken(errorAxiosInstance.config);
      }
      // For other errors, reject the promise
      return Promise.reject(errorAxiosInstance);
    },
  );

  return baseAxios;
};

export default useAxios;
