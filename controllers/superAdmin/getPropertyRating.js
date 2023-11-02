import * as dotenv from "dotenv";
dotenv.config();
import ratingModel from "../../models/superAdmin/rating.js";

const getPropertyRating = async (req, res) => {
        try{
            const propertyRating = await ratingModel.find({}).select('propertyRatingId propertyRating').lean();
            return res.status(200).json({data:propertyRating , statusCode: 200});

        }catch (error) {
            return res.status(500).json({ error: error.message, statusCode: 500 });
        }
};

export default getPropertyRating;