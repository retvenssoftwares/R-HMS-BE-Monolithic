import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import amenityTypeModel from "../../models/superAdmin/amenityType.js";

const postAmenityType = async (req , res) =>{
    try{
         const {
        
            amenityTypeId,
            amenityType, 

         }= req.body;

         const newAccount = new amenityTypeModel({
            amenityTypeId : Randomstring.generate(8),
            amenityType, 

         });

         await newAccount.save();
         return res.status(200).json({message : "New amenityType added successfully", statusCode : 200});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default postAmenityType;