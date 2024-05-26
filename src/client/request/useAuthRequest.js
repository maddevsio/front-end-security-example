import useAxios from './baseAxios';
import { getEncrypted, sanitizePayload } from './helpers';

const useAuthRequest = () => {
  const baseAxios = useAxios();

  // reusable function that executes a required request without any checks
  const makeGenericRequest = async (endpoint, method) => {
    try {
      return await baseAxios[method](endpoint);
    } catch (err) {
      console.error('Request failed:', err);
      alert(err.message);
      throw err;
    }
  };

  // reusable function that sanitizes and encrypts user input before submitting POST request to the server
  const postRequest = async (endpoint, payload) => {
    if (!payload) throw new Error('Invalid data');

    // Use DOMPurify to sanitize user's input at FE
    const sanitizedPayload = sanitizePayload(payload);

    try {
      return await baseAxios.post(endpoint, { data: getEncrypted(JSON.stringify(sanitizedPayload)) });
    } catch (err) {
      console.error('POST request failed:', err);
      alert(err.message);
      throw err;
    }
  };

  return { makeGenericRequest, postRequest };
};

export default useAuthRequest;
