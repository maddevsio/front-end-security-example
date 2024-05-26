import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxios = () => {
  const baseAxios = axios.create({
    withCredentials: true,
  });
  const navigate = useNavigate();

  async function refreshAuthToken() {
    try {
      const response = await axios.post('/api/refresh');
      if (response.status === 200 && response.data.authToken) {
        return response.data.authToken;
      }

      // Failed to refresh
      navigate('/login', { replace: true });
      return null;
    } catch (error) {
      console.error('Error while refreshing token:', error);
      navigate('/login', { replace: true });
      return null;
    }
  }

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
          return axios(errorAxiosInstance.config);
        });
      }
      // For other errors, reject the promise
      return Promise.reject(errorAxiosInstance);
    },
  );

  return baseAxios;
};

export default useAxios;
