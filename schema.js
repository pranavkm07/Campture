//! These server-side validations can be tested from ThunderClient/Postman 
const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
  }).required()

}) //* for validating 
