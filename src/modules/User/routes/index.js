const express = require('express');
const { validate, catchErrors } = require('../../../helpers');
const userController = require('../controllers');
const policies = require('../policies');

const router = express.Router();

router.post(
  '/register',
  validate(policies.register),
  catchErrors(userController.register),
);

router.post(
  '/login',
  validate(policies.login),
  catchErrors(userController.login),
);

module.exports = router;
