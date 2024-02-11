const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true
  }
}) 

UserSchema.plugin(passportLocalMongoose); //* This is going to add on username and password and make sures it is unique
module.exports = mongoose.model('User', UserSchema);