import { log } from 'console';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Function to encrypt text
function encrypt(text, encryptionKey, iv) {
    const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Function to decrypt text
function decrypt(encrypted, encryptionKey, iv) {
    const decipher = createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Example usage:
const encryptionKey = randomBytes(32); // Generate a random encryption key
log(encryptionKey)
const iv = randomBytes(16); // Generate a random IV
log(iv)
const originalText = 'text to be encrypted';
const encryptedText = encrypt(originalText, encryptionKey, iv);
console.log('Encrypted:', encryptedText);

const decryptedText = decrypt(encryptedText, encryptionKey, iv);
console.log('Decrypted:', decryptedText);
