const mongoose = require('../db');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  balances: {
    type: Object,
    default: [],
  },
});

module.exports = mongoose.model('User', userSchema);
