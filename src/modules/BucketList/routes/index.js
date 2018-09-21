const express = require('express');
const { validate, catchErrors } = require('../../../helpers');
const bucketListController = require('../controllers');
const { authenticate, validateId } = require('../../../middlewares');
const policies = require('../policies');

const router = express.Router();

router.post(
  '/',
  catchErrors(authenticate),
  validate(policies.createBucket),
  catchErrors(bucketListController.createBucket),
);

router.get(
  '/',
  catchErrors(authenticate),
  validate(policies.getBuckets),
  catchErrors(bucketListController.getBuckets),
);

router.get(
  '/:bucketId',
  catchErrors(authenticate),
  validate(policies.getOneBucket),
  catchErrors(validateId),
  catchErrors(bucketListController.getOneBucket),
);

router.put(
  '/:bucketId',
  catchErrors(authenticate),
  validate(policies.updateOneBucket),
  catchErrors(validateId),
  catchErrors(bucketListController.updateOneBucket),
);

router.delete(
  '/:bucketId',
  catchErrors(authenticate),
  validate(policies.deleteOneBucket),
  catchErrors(validateId),
  catchErrors(bucketListController.deleteOneBucket),
);

router.post(
  '/:bucketId/items',
  catchErrors(authenticate),
  validate(policies.createItem),
  catchErrors(validateId),
  catchErrors(bucketListController.createOneItem),
);

router.get(
  '/:bucketId/items',
  catchErrors(authenticate),
  validate(policies.getOneBucket),
  catchErrors(validateId),
  catchErrors(bucketListController.getAllItems),
);

router.put(
  '/:bucketId/items/:itemId',
  catchErrors(authenticate),
  validate(policies.updateOneItem),
  catchErrors(validateId),
  catchErrors(bucketListController.updateOneItem),
);
router.get(
  '/:bucketId/items/:itemId',
  catchErrors(authenticate),
  validate(policies.getOneItem),
  catchErrors(validateId),
  catchErrors(bucketListController.getOneItem),
);

router.delete(
  '/:bucketId/items/:itemId',
  catchErrors(authenticate),
  validate(policies.getOneItem),
  catchErrors(validateId),
  catchErrors(bucketListController.deleteOneItem),
);

module.exports = router;
