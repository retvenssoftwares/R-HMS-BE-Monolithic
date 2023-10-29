import Randomstring, { generate } from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import accountTypeModel from "../../models/superAdmin/accountType.js";

const postAccountType = async (req , res) =>{
    try{
         const {
        
            accountTypeId,
            accountType, 

         }= req.body;

         const newAccount = new accountTypeModel({
               accountTypeId : Randomstring.generate(8),
               accountType, 

         });

         await newAccount.save();
         return res.status(200).json({message : "New accountType added successfully", statusCode : 200});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default postAccountType;