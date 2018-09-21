const joi = require('joi');

module.exports.register = {
  body: {
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().max(50).required(),
    password: joi.string().min(6).max(32).required(),
    confirm: joi.string().min(6).max(32).required(),
  },
};

module.exports.login = {
  body: {
    email: joi.string().required(),
    password: joi.string().required(),
  },
};
