const crypto = require("crypto");

const ALGORITHM = "aes-256-ctr";

let key = "MySuperSecretKey";
key = crypto
  .createHash("sha256")
  .update(String(key))
  .digest("base64")
  .substr(0, 32);

exports.encryptBuffer = (buffer) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);

  return result;
};

exports.decryptBuffer = (encrypted) => {
  const iv = encrypted.slice(0, 16);

  encrypted = encrypted.slice(16);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return result;
};

// const plain = Buffer.from("Hello world");

// const encrypted = encrypt(plain);
// console.log("Encrypted:", encrypted.toString());

// const decrypted = decrypt(encrypted);
// console.log("Decrypted:", decrypted.toString());
