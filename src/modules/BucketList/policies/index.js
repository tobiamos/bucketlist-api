const joi = require('joi');

module.exports.createBucket = {
  body: {
    name: joi.string().required(),
  },
};

module.exports.getBuckets = {
  query: {
    page: joi.number().optional(),
    limit: joi.number().max(100).optional(),
    q: joi.string().optional(),
  },
};

module.exports.getOneBucket = {
  params: {
    bucketId: joi.string().required(),
  },
};

module.exports.updateOneBucket = {
  params: {
    bucketId: joi.string().required(),
  },
  body: {
    name: joi.string().required(),
  },
};

module.exports.deleteOneBucket = {
  params: {
    bucketId: joi.string().required(),
  },
};

module.exports.createItem = {
  params: {
    bucketId: joi.string().required(),
  },
  body: {
    name: joi.string().required(),
    done: joi.boolean().required(),
  },

};

module.exports.getOneItem = {
  params: {
    bucketId: joi.string().required(),
    itemId: joi.string().required(),
  },
};

module.exports.updateOneItem = {
  params: {
    bucketId: joi.string().required(),
    itemId: joi.string().required(),
  },
  body: {
    name: joi.string().optional(),
    done: joi.string().optional(),
  },
};
