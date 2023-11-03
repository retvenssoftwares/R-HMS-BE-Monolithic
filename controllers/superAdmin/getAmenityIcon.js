import * as dotenv from "dotenv";
dotenv.config();
import amenityIconModel from "../../models/superAdmin/amenityIcon.js";

const getAmenityIcon = async (req, res) => {
      try{
        const amenityIcon = await amenityIconModel.find({}).select('amenityIconId  amenityIconLink amenityIconTags').lean();
        return res.status(200).json({data:amenityIcon , statusCode: 200});
      }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default getAmenityIcon;