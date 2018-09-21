const { validate: joivalidate } = require('joi');
const { badRequest } = require('boom');

module.exports = {
  sendJSONResponse(res, status, data, method, message) {
    res.status(status);
    res.json({
      status,
      method,
      message,
      data,
    });
  },
  catchErrors(fn) {
    const caught = (req, res, next) => fn(req, res, next).catch(next);
    return caught;
  },
  getCurrentTimeStamp() {
    return Math.floor(new Date().getTime() / 1000);
  },
  objFromArray(first, second) {
    const obj = {};
    if (first.length === second.length) {
      first.forEach((item) => {
        second.forEach((value) => {
          obj[value] = item;
        });
        second.shift();
      });
      return obj;
    }
    return {};
  },

  validate(schema, options) {
    const requestOptions = options || {};

    return function validateRequest(req, res, next) {
      const toValidate = {};
      /* istanbul ignore if */
      if (!schema) {
        return next();
      }

      ['params', 'body', 'query'].forEach((key) => {
        if (schema[key]) {
          toValidate[key] = req[key];
        }
      });

      function onValidationComplete(err, validated) {
        if (err) {
          return next(badRequest(err.message, err.details));
        }

        // copy the validated data to the req object
        Object.assign(req, validated);

        return next();
      }
      return joivalidate(toValidate, schema, requestOptions, onValidationComplete);
    };
  },

};
