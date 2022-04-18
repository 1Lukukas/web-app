const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Record', recordSchema)