import * as dotenv from "dotenv";
dotenv.config();
import amenityTypeModel from "../../models/superAdmin/amenityType.js";

const getAmenityType = async (req, res) => {
        try{
            const amenityTypes = await amenityTypeModel.find({}).select('amenityTypeId amenityType').lean();
            return res.status(200).json({data:amenityTypes , statusCode: 200});

        }catch (error) {
            return res.status(500).json({ error: error.message, statusCode: 500 });
        }
};

export default getAmenityType;