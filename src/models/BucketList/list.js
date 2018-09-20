const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  done: Boolean,
}, { timestamps: true });

const BucketListSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

}, { timestamps: true });

module.exports = mongoose.model('BucketList', BucketListSchema);
