const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

const User = mongoose.model('User');

module.exports.register = async (req, res) => {
  const {
    name, email, password, confirm,
  } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendJSONResponse(res, 400, null, req.method, 'An account with this email already exists');
  }
  if (password !== confirm) {
    return sendJSONResponse(res, 400, null, req.method, 'Passwords do not match');
  }
  const user = new User();
  user.name = name;
  user.email = email;
  user.setPassword(password);
  await user.save();
  const token = user.generateJWT();
  return sendJSONResponse(
    res,
    200,
    {
      name: user.name,
      email: user.email,
      token,
    },
    req.method,
    'Account created successfully',
  );
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Login Credentials');
  }
  const validPassword = user.verifyPassword(password);
  if (!validPassword) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Login Credentials');
  }
  const token = user.generateJWT();
  return sendJSONResponse(res, 200, { name: user.name, email: user.email, token }, req.method, 'Login Successful');
};
