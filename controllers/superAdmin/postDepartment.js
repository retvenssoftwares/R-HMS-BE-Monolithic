import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import departmentTypeModel from "../../models/superAdmin/department.js";

const departmentType = async (req , res) =>{
       try{
            const {
                departmentId,
                departmentName,

            }= req.body;

            const newDepartment = new departmentTypeModel ({
                departmentId : Randomstring.generate(8),
                departmentName,
                displayStatus: '1'
             });
             await newDepartment.save();
             return res.status(200).json({ message: "New Department added successfully", statuscode: 200 });

       }catch(err){
       console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }   

};
export default departmentType;
