import * as dotenv from "dotenv";
dotenv.config();
import propertyTypeModel from "../../models/superAdmin/propertyType.js";

const getPropertyType = async (req, res) => {
        try{
            const propertytype = await propertyTypeModel.find({}).select('propertyTypeId propertyType').lean();
            return res.status(200).json({data:propertytype , statusCode: 200});

        }catch (error) {
            return res.status(500).json({ error: error.message, statusCode: 500 });
        }
};

export default getPropertyType;