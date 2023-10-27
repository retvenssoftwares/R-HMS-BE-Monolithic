import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import bedTypeModel from "../../models/bedType.js";

const bedType = async (req , res) =>{
    try{
        const {

           bedTypeId,
           bedType,

        }= req.body;
      
        const newBed = new bedTypeModel({
               bedTypeId : Randomstring.generate(8),
               bedType,
        });
        await newBed.save();
        return res.status(200).json({ message: "New bedType added successfully", statuscode: 200 });

    } catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   

};

export default bedType;