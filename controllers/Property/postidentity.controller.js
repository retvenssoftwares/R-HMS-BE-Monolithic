import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import identityModel from "../../models/identityTypes.js";

const userIdentity = async (req , res) =>{
    try{
       const {
          shortCode,
          createdBy,
          createdOn,
          modifiedBy,
          modifiedOn,
          identityType,
       }= req.body;
       const newIdentity = new identityModel({
            
           shortCode,
           createdBy,
           createdOn,
           modifiedBy : [
            
           ],
           modifiedOn : [

           ],
           identityType : [{
             identityType : identityType

       }]

       });
       await newIdentity.save();
       return res.status(200).json({ message: "New identity added successfully", statuscode: 200 });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default userIdentity;
