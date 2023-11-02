import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import inclusionTypeModel from "../../models/superAdmin/inclusionType.js";

const inclusionType = async (req , res) =>{
    try{
         const {
           inclusionTypeId,
           inclusionType,

         }= req.body;

         const newInclusion = new inclusionTypeModel ({
                    inclusionTypeId : Randomstring.generate(8),
                    inclusionType,
         });
         await newInclusion.save();
         return res.status(200).json({ message: "New inclusionType added successfully", statuscode: 200 });

    }catch(err){
    console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   
};

export default inclusionType;