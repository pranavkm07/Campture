const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchma = new Schema({
  body: String,
  rating: Number
})

module.exports = mongoose.model("Review", reviewSchma);