import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import employmentTypeModel from "../../models/superAdmin/employmentType.js";

const employmentType = async (req , res) =>{
       try{
            const {
                employmentId,
                employmentTypeName,

            }= req.body;

            const newEmployment = new employmentTypeModel ({
                employmentId : Randomstring.generate(8),
                employmentTypeName,
                displayStatus : '1'
             });
             await newEmployment.save();
             return res.status(200).json({ message: "New Employment added successfully", statuscode: 200 });

       }catch(err){
       console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   

};
export default employmentType;
