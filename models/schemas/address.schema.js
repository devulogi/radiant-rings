const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  street: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50
  },
  city: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50
  },
  state: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50
  },
  country: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50
  },
  zip: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50
  }
});

module.exports = addressSchema;
