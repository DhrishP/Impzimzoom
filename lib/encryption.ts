import CryptoJS from "crypto-js";

export function encryptPassword(password: string, secretKey: string): string {
  if (!password || !secretKey) {
    throw new Error("Password and secret key are required");
  }

  try {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt password");
  }
}

export function decryptPassword(
  encryptedPassword: string,
  secretKey: string
): string {
  if (!encryptedPassword || !secretKey) {
    throw new Error("Encrypted password and secret key are required");
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // Verify the decryption was successful
    if (!decrypted) {
      throw new Error("Invalid secret key or corrupted password");
    }

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt password");
  }
}
