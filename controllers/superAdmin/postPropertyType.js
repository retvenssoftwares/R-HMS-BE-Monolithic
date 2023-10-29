import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/superAdmin/propertyType.js";

const PropertyType = async (req , res) =>{
    try{
         const {
            propertyTypeId,
            propertyType,

         }= req.body;

         const newPropertyType = new propertyModel ({
            propertyTypeId : Randomstring.generate(8),
            propertyType,
         });
         await newPropertyType.save();
         return res.status(200).json({ message: "New PropertyType added successfully", statuscode: 200 });

    }catch(err){
    console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   
};

export default PropertyType;