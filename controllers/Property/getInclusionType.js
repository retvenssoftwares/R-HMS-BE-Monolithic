import * as dotenv from "dotenv";
dotenv.config();
import inclusionTypeModel from "../../models/inclusionType.js";

const getInclusionType = async (req , res)=>{
    try{
        const inclusionTypes = await inclusionTypeModel.find({}).select('inclusionTypeId inclusionType -_id').lean();
            return res.status(200).json({inclusionTypes , statusCode: 200});

    }catch(error){
        return res.status(500).json({error: error.message, statusCode: 500});
    }
};

export default getInclusionType;
