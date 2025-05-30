// import { createCipheriv, createDecipheriv } from 'crypto';

// // Validate environment variables early
// const IV_HEX = process.env.NEXT_PUBLIC_IV;
// const KEY_HEX = process.env.NEXT_PUBLIC_KEY;
// console.log("IV_HEX", IV_HEX);
// console.log("KEY_HEX", KEY_HEX);

// if (!IV_HEX || !KEY_HEX) {
//   throw new Error('Missing encryption keys in environment variables (NEXT_PUBLIC_IV or NEXT_PUBLIC_KEY)');
// }

// // Convert hex strings to Buffers (IV must be 16 bytes, Key must be 32 bytes)
// const IV = Buffer.from(IV_HEX, 'hex');
// const KEY = Buffer.from(KEY_HEX, 'hex');

// if (IV.length !== 16) {
//   throw new Error(`Invalid IV length: ${IV.length} bytes (must be 16 bytes for AES-256-CBC)`);
// }

// if (KEY.length !== 32) {
//   throw new Error(`Invalid KEY length: ${KEY.length} bytes (must be 32 bytes for AES-256)`);
// }

// /**
//  * Encrypts data using AES-256-CBC.
//  * @param {object|string} request_data - Data to encrypt.
//  * @returns {string} Encrypted data in base64, or empty string on failure.
//  */
// export function encrypt(request_data) {
//   if (!request_data) return '';

//   try {
//     const data = typeof request_data === 'object' 
//       ? JSON.stringify(request_data) 
//       : String(request_data);

//     const cipher = createCipheriv('aes-256-cbc', KEY, IV);
//     let encrypted = cipher.update(data, 'utf8', 'base64');
//     encrypted += cipher.final('base64');
//     console.log("Encrypted Data:", encrypted); // Debugging line
//     return encrypted;
//   } catch (error) {
//     console.error('Encryption Error:', error);
//     return '';
//   }
// }

// /**
//  * Decrypts data using AES-256-CBC.
//  * @param {string} request_data - Encrypted data in base64.
//  * @returns {object|string} Decrypted data, or original input if decryption fails.
//  */
// export function decrypt(request_data) {
//   if (!request_data) return {};
//   console.log("Request Data:", request_data); // Debugging line

//   try {
//     // Skip decryption if input isn't base64
//     if (!isBase64(request_data)) {
//       console.log("Not Base64, trying to parse as JSON:", request_data); // Debugging line
//       return tryParseJson(request_data);
//     }

//     const decipher = createDecipheriv('aes-256-cbc', KEY, IV);
//     // Changed 'hex' to 'base64' here to match the encryption function
//     let decrypted = decipher.update(request_data, 'base64', 'utf8');
//     console.log("Decrypted Part 1:", decrypted); // Debugging line
//     decrypted += decipher.final('utf8');
//     console.log("Decrypted Data:", decrypted); // Debugging line
//     return isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
//   } catch (error) {
//     console.error('Decryption Error:', error);
//     return {};
//   }
// }

// // --- Helper Functions ---

// function isJson(data) {
//   try {
//     JSON.parse(data);
//     return true;
//   } catch {
//     return false;
//   }
// }

// function tryParseJson(data) {
//   try {
//     return JSON.parse(data);
//   } catch {
//     return data;
//   }
// }

// function isBase64(str) {
//   if (typeof str !== 'string') return false;
  
//   // Base64 regex (supports URL-safe variants)
//   const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
//   return base64Regex.test(str) && str.length % 4 === 0;
// }