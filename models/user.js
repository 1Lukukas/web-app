const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
      type: String,
      required: true,
      unique: true
  },
  username: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true
  },
  records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Record' }]
})

module.exports = mongoose.model('User', userSchema)