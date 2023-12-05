const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./address.schema');

const orderSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 50
    },
    address: addressSchema,
    status: {
      type: String,
      required: true,
      enum: ['pending', 'shipped', 'delivered'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = orderSchema;
