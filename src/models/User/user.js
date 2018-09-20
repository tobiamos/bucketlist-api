const mongoose = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');
const { sign } = require('jsonwebtoken');
const { secret } = require('../../config');

const UserSchema = new mongoose.Schema({
  name: { type: String, lowercase: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  hash: String,
  salt: String,
}, { timestamps: true });

UserSchema.methods.setPassword = function adminPassword(password) {
  this.salt = randomBytes(16).toString('hex');
  this.hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
};

UserSchema.methods.verifyPassword = function verify(password) {
  const hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function token() {
  return sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      userType: this.userType,
    },
    secret, {
      issuer: 'https://gokada.ng',
      expiresIn: '7d',
    },
  );
};

module.exports = mongoose.model('User', UserSchema);
