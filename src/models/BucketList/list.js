const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  done: { type: Boolean, default: false },
}, { timestamps: true });

const BucketListSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  items: [itemSchema],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

}, { timestamps: true });

BucketListSchema.index({
  name: 'text',
  description: 'text',
});
module.exports = mongoose.model('BucketList', BucketListSchema);
