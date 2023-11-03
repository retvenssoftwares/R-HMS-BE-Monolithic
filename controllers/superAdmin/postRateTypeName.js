import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import rateTypeModel from "../../models/superAdmin/rateType.js";

const RateType = async (req , res) =>{
    try{
         const {
            rateTypeId,
            rateType,

         }= req.body;

         const newRateType = new rateTypeModel ({
            rateTypeId : Randomstring.generate(8),
            rateType,
         });
         await newRateType.save();
         return res.status(200).json({ message: "New rate type added successfully", statuscode: 200 });

    }catch(err){
    console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   
};

export default RateType;