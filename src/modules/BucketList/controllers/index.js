const { model } = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

const BucketList = model('BucketList');

module.exports.createBucket = async (req, res) => {
  const { name } = req.body;
  const bucket = new BucketList();
  bucket.name = name;
  bucket.createdBy = req.decoded._id;
  await bucket.save();
  return sendJSONResponse(res, 200, { bucket }, req.method, 'Bucket created sucessfully');
};

module.exports.getBuckets = async (req, res) => {
  const buckets = await BucketList.find({ createdBy: req.decoded._id });
  return sendJSONResponse(res, 200, { buckets }, req.method, 'Bucket Lists fetched successfully');
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
  const item = await BucketList.findById(req.params.bucketId).populate({
    path: 'items',
    match: { _id: req.params.itemId },
  }).exec();
  if (!item) {
    return sendJSONResponse(res, 404, null, req.method, 'Item not found');
  }
  return sendJSONResponse(res, 200, { item }, req.method, 'Item fetched sucessfully');
};

module.exports.updateOneItem = async (req, res) => {
  const filter = { _id: req.params.bucketId, 'item._id': req.params.itemId };
  const update = req.body;
  const item = BucketList.findByIdAndUpdate(filter, update, { new: true, runValidators: true });
  return sendJSONResponse(res, 200, { item }, req.method, 'Item updated sucessfully');
};

module.exports.deleteOneItem = async (req, res) => {
  const items = await BucketList.findById(req.params.bucketId).select('items');
  items.id(req.params.itemId).remove();
  return sendJSONResponse(res, 200, null, req.method, 'Item deleted sucessfully');
};
