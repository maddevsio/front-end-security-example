import CryptoJS from 'crypto-js';

export const getEncrypted = (plaintextData) => CryptoJS.AES.encrypt(plaintextData, process.env.ENCRYPTION_KEY).toString();
