const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

const BucketList = mongoose.model('BucketList');

module.exports.createBucket = async (req, res) => {
  const { name } = req.body;
  const bucket = new BucketList();
  bucket.name = name;
  bucket.createdBy = req.decoded._id;
  await bucket.save();
  return sendJSONResponse(res, 200, { bucket }, req.method, 'Bucket created sucessfully');
};

module.exports.searchBucketList = async (req, res, next) => {
  if (!req.query.q) {
    return next();
  }
  const bucketLists = await BucketList.find({
    $text: {
      $search: req.query.q,
    },
  }, {
    score: { $meta: 'textScore' },
  })
  // the sort them
    .sort({
      score: { $meta: 'textScore' },
    });
  if (!bucketLists.length) {
    return sendJSONResponse(res, 404, null, req.method, `Your search for ${req.query.q} did not return any results`);
  }
  return sendJSONResponse(
    res,
    200,
    { bucketLists },
    req.method,
    `Your search for ${req.query.q} returned ${bucketLists.length} results`,
  );
};

module.exports.getBuckets = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const skip = (page * limit) - limit;
  const bucketsPromise = BucketList
    .find({ createdBy: req.decoded._id })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: 'desc' });
  const countPromise = BucketList.find({ createdBy: req.decoded._id }).count();
  const [bucketLists, count] = await Promise.all([bucketsPromise, countPromise]);
  const pages = Math.ceil(count / limit);
  if (!bucketLists.length && skip) {
    return sendJSONResponse(res, 404, null, req.method, 'Bucket lists not found ');
  }

  return sendJSONResponse(res, 200, {
    bucketLists, page, pages, count,
  }, req.method, 'Bucket Lists fetched successfully');
};

module.exports.getOneBucket = async (req, res) => {
  const bucket = await BucketList.findById(req.params.bucketId);
  if (!bucket) {
    return sendJSONResponse(res, 404, null, req.method, 'Bucket List not found');
  }
  return sendJSONResponse(res, 200, { bucket }, req.method, 'Bucket List fetched successfully');
};

module.exports.updateOneBucket = async (req, res) => {
  const { name } = req.body;
  const bucket = await BucketList.findById(req.params.bucketId);
  if (!bucket) {
    return sendJSONResponse(res, 404, null, req.method, 'Bucket List not found');
  }
  bucket.name = name;
  await bucket.save();
  return sendJSONResponse(res, 200, { bucket }, req.method, 'Updated Bucket succssfully');
};

module.exports.deleteOneBucket = async (req, res) => {
  await BucketList.findByIdAndRemove(req.params.bucketId);
  return sendJSONResponse(res, 200, null, req.method, 'Deleted Bucket List successfully');
};

module.exports.createOneItem = async (req, res) => {
  const { bucketList } = req;
  const { name, done } = req.body;
  bucketList.items.push({ name, done });
  await bucketList.save();
  return sendJSONResponse(res, 200, { bucketList }, req.method, 'Added a new item to bucket list');
};

module.exports.getAllItems = async (req, res) => {
  const { bucketList: { items } } = req;
  return sendJSONResponse(res, 200, { items }, req.method, 'Fetched all items in bucket list');
};

module.exports.getOneItem = async (req, res) => {
  const items = await BucketList
    .findById(req.params.bucketId)
    .select('items')
    .exec();
  const thisItem = items.items.id(req.params.itemId);

  if (!thisItem) {
    return sendJSONResponse(res, 404, null, req.method, 'Item not found');
  }
  return sendJSONResponse(res, 200, { thisItem }, req.method, 'Item fetched sucessfully');
};

module.exports.updateOneItem = async (req, res) => {
  const { name, done } = req.body;
  const items = await BucketList
    .findById(req.params.bucketId)
    .select('items')
    .exec();
  const thisItem = items.items.id(req.params.itemId);
  name ? thisItem.name = name : thisItem.name = thisItem.name;
  done ? thisItem.done = done : thisItem.done = thisItem.done;
  await items.save();
  return sendJSONResponse(res, 200, { thisItem }, req.method, 'Item updated sucessfully');
};

module.exports.deleteOneItem = async (req, res) => {
  const items = await BucketList
    .findById(req.params.bucketId)
    .select('items')
    .exec();
  items.items.id(req.params.itemId).remove();
  await items.save();
  return sendJSONResponse(res, 200, null, req.method, 'Item deleted sucessfully');
};
