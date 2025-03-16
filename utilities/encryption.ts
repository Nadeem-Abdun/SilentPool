import forge from "node-forge";

const algorithm = "AES-CBC"; // AES encryption with CBC mode
const keySize = 32; // 256-bit key (AES-256)
const ivSize = 16; // 128-bit IV

// Function to generate a secure encryption key (32 bytes for AES-256)
export const generateEncryptionKey = (): string => {
  return forge.util.bytesToHex(forge.random.getBytesSync(keySize));
};

// Encrypt message using AES-CBC
export const encryptMessage = (message: string, key: string): string => {
  const iv = forge.random.getBytesSync(ivSize); // Generate a random IV
  const cipher = forge.cipher.createCipher(algorithm, forge.util.hexToBytes(key));
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(message, "utf8"));
  cipher.finish();

  // Return IV and encrypted data as hex string
  return `${forge.util.bytesToHex(iv)}:${forge.util.bytesToHex(cipher.output.getBytes())}`;
};

// Decrypt message using AES-CBC
export const decryptMessage = (encryptedMessage: string, key: string): string => {
  const [ivHex, encryptedHex] = encryptedMessage.split(":");
  const iv = forge.util.hexToBytes(ivHex);
  const encryptedBytes = forge.util.hexToBytes(encryptedHex);

  const decipher = forge.cipher.createDecipher(algorithm, forge.util.hexToBytes(key));
  decipher.start({ iv });
  decipher.update(forge.util.createBuffer(encryptedBytes));
  const success = decipher.finish();

  if (!success) throw new Error("Decryption failed");

  return decipher.output.toString();
};
