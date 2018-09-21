const { ObjectID } = require('mongodb');
const { model } = require('mongoose');
const { verify } = require('jsonwebtoken');
const { promisify } = require('util');
const { sendJSONResponse } = require('../helpers');
const { secret } = require('../config');

const BucketList = model('BucketList');
const verifyPromise = promisify(verify);

module.exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendJSONResponse(
      res,
      401,
      null,
      req.method,
      'Authentication Failed, Please provide an authentication token',
    );
  }
  try {
    const decoded = await verifyPromise(token, secret);
    req.decoded = decoded;
    return next();
  } catch (error) {
    return sendJSONResponse(res, 401, { error }, req.method, 'Authentication Failed');
  }
};

module.exports.validateId = async (req, res, next) => {
  if (!ObjectID.isValid(req.params.bucketId)) {
    return sendJSONResponse(res, 400, null, req.method, 'Bucketlist id is not valid');
  }
  const bucketList = await BucketList.findById(req.params.bucketId);
  if (!bucketList) {
    return sendJSONResponse(res, 404, null, req.method, 'Bucketlist not found');
  }
  req.bucketList = bucketList;
  return next();
};
