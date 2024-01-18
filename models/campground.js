const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/campture')
    .then(() => {
        console.log('Connection Open to create model');
    })
    .catch(err => {
        console.log('Error Occurred');
        console.log(err);
    });

const Schema = mongoose.Schema;

const CamgroundSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    }
});

// Export the Mongoose model
const Campground = mongoose.model("campground", CamgroundSchema);
module.exports = Campground;
