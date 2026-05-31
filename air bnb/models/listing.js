const mongoose = require('mongoose');
const { listingSchema } = require('../schema');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?v=1",
            set: (v) => v === "" 
                ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?v=1" 
                : v
        },
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }]
});

ListingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
    await Review.deleteMany({ _id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;