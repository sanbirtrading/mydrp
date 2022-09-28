const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const initVector = crypto.randomBytes(16);
const securityKey = crypto.randomBytes(32);
const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);

module.exports = {
  cipher,
  decipher,
};
