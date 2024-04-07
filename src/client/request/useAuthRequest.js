import DOMPurify from 'dompurify';
import useAxios from './baseAxios';
import { getEncrypted } from './getEncrypted';

const useAuthRequest = () => {
  const baseAxios = useAxios();

  const makeRequest = async (endpoint, method) => {
    try {
      return await baseAxios[method](endpoint);
    } catch (err) {
      console.error('Request failed:', err);
      alert(err.message);
      throw err;
    }
  };

  const postRequest = async (endpoint, payload) => {
    if (!payload) throw new Error('Invalid data');

    // Use DOMPurify to sanitize user's input at FE
    const purifiedPayload = DOMPurify.sanitize(payload);

    try {
      return await baseAxios.post(endpoint, { data: getEncrypted(purifiedPayload) });
    } catch (err) {
      console.error('POST request failed:', err);
      alert(err.message);
      throw err;
    }
  };

  return { makeRequest, postRequest };
};

export default useAuthRequest;
