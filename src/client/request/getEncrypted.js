import CryptoJS from 'crypto-js';

export const getEncrypted = (plaintextData) => {
 const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
 return  CryptoJS.AES.encrypt(plaintextData, encryptionKey).toString()
};
