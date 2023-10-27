import * as dotenv from "dotenv";
dotenv.config();
import accountTypeModel from "../../models/accountType.js";

const getAccountType = async (req , res)=>{
     try{
        const accountTypes = await accountTypeModel.find({}).select('accountTypeId accountType -_id').lean();
        return res.status(200).json({accountTypes , statusCode: 200});

     }catch(error){
        return res.status(500).json({error: error.message, statusCode: 500});
     }
};

export default getAccountType;