import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import ratingModel from "../../models/superAdmin/rating.js";

const PropertyRating = async (req , res) =>{
    try{
         const {
            propertyRatingId,
            propertyRating,

         }= req.body;

         const newRating = new ratingModel ({
            propertyRatingId : Randomstring.generate(8),
            propertyRating,
         });
         await newRating.save();
         return res.status(200).json({ message: "New Rating added successfully", statuscode: 200 });

    }catch(err){
    console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   
};

export default PropertyRating;