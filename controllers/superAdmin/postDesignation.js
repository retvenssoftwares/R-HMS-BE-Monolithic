import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import designationTypeModel from "../../models/superAdmin/designation.js";

const designationType = async (req , res) =>{
    try{
         const {
            designationId,
            designation,

         }= req.body;

         const newDesignation = new designationTypeModel ({
            designationId : Randomstring.generate(8),
            designation,
         });
         await newDesignation.save();
         return res.status(200).json({ message: "New Designation added successfully", statuscode: 200 });

    }catch(err){
    console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   
};

export default designationType;