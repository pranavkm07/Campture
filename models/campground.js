const mongoose = require("mongoose");
const { campgroundSchema } = require("../schema");
const Review = require('./review');
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
//* https://res.cloudinary.com/dlf59vhjs/image/upload/v1707833196/Campture/nhccwpeax4u2hcra8xdo.jpg 
const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () { //* Virtual Property
    return this.url.replace('/upload', '/upload/w_150');
})
const opts = { toJSON: { virtuals: true } };
const CamgroundSchema = new Schema({
    title: {
        type: String
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

}, opts);

//* for mapbox popup
CamgroundSchema.virtual('properties.popUpMarkup').get(function (){
    return `<a href='/campground/${this._id}'><h6>${this.title}</h6></a>`
})
//* Mongoose Hooks/Triggers

CamgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        //* In the Review collection, remove all the documents that are referenced.
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
// Export the Mongoose model
const Campground = mongoose.model("campground", CamgroundSchema);
module.exports = Campground;
