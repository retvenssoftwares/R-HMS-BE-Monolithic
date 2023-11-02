import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const ratingSchema =  new mongoose.Schema({
      
    propertyRatingId : {
        type : String,
        default : ''
    },
    
    propertyRating : {
        type : String,
        default : ''
    },

});

const propertyRating = db1.model('propertyrating', ratingSchema);

export default propertyRating;