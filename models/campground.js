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

const CamgroundSchema = new Schema({
    title: {
        type: String
    },
    image:{
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
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

});
//* Mongoose Hooks/Triggers

CamgroundSchema.post('findOneAndDelete', async (doc)=>{
    if(doc){
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
