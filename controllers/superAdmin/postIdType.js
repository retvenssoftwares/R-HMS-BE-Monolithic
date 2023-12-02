import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import idTypeModel from "../../models/superAdmin/idType.js";

const idType = async (req , res) =>{
       try{
            const {
                idTypeId,
                idName,

            }= req.body;

            const newId = new idTypeModel ({
                idTypeId : Randomstring.generate(8),
                idName,
                displayStatus : '1'
             });
             await newId.save();
             return res.status(200).json({ message: "New idType added successfully", statuscode: 200 });

       }catch(err){
       console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   

};
export default idType;
