import * as dotenv from "dotenv";
dotenv.config();
import rateTypeModel from "../../models/superAdmin/rateType.js";

const getRateTypeModels = async (req, res) => {
       try{
        const getRateType = await rateTypeModel.find({}).select('rateTypeId rateType').lean();
        return res.status(200).json({data:getRateType , statusCode: 200});

       }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default getRateTypeModels;
