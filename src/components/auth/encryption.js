// src/utils/encryption.js
import CryptoJS from "crypto-js";

// Secret key (should be stored securely, not hardcoded in production)
const SECRET_KEY = process.env.REACT_APP_SALT;

export function encryptData(plainText) {
  // Generate random salt and IV
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);

  // Derive key using PBKDF2
  const key = CryptoJS.PBKDF2(SECRET_KEY, salt, {
    keySize: 256 / 32,
    iterations: 1000
  });

  // Encrypt
  const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv });

  return {
    salt: CryptoJS.enc.Base64.stringify(salt),
    iv: CryptoJS.enc.Base64.stringify(iv),
    ciphertext: encrypted.toString()
  };
}

export function decryptData(encryptedData) {
  const salt = CryptoJS.enc.Base64.parse(encryptedData.salt);
  const iv = CryptoJS.enc.Base64.parse(encryptedData.iv);

  const key = CryptoJS.PBKDF2(SECRET_KEY, salt, {
    keySize: 256 / 32,
    iterations: 1000
  });

  const decrypted = CryptoJS.AES.decrypt(encryptedData.ciphertext, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
