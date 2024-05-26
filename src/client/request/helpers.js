import CryptoJS from 'crypto-js';
import DOMPurify from "dompurify";

export const getEncrypted = (plaintextData) => {
 const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
 return CryptoJS.AES.encrypt(plaintextData, encryptionKey).toString()
};

export const sanitizeString = (string) => DOMPurify.sanitize(string)

export const sanitizePayload = (payload) => {
  const sanitizedPayload = {};
  for (const key in payload) {
    if (payload.hasOwnProperty(key) && typeof payload[key] === 'string')
      sanitizedPayload[key] = sanitizeString(payload[key]);
    else
      sanitizedPayload[key] = payload[key];
  }
  return sanitizedPayload;
};
