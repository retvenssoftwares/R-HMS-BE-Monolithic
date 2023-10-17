import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import identityModel from "../../models/identityTypes.js";
import verifiedUser from "../../models/verifiedUsers.js";
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'

const userIdentity = async (req , res) =>{
    try{
       const {
          userId,
          shortCode,
          createdBy,
          createdOn,
          modifiedBy,
          modifiedOn,
          identityType,
          propertyId,
       }= req.body;
       const findUser = await verifiedUser.findOne({ userId })
       if(findUser){
         
           let userRole = findUser.role[0].role
           const newIdentity = new identityModel({
               userId,
               shortCode,
               createdBy : userRole,
               createdOn :  await getCurrentUTCTimestamp(),
               modifiedBy : [
                
               ],
               modifiedOn : [
    
               ],
               identityType : [{
                 identityType : identityType
                
           }],

             propertyId,

             identityTypeId : Randomstring.generate(8)

    
           });
           await newIdentity.save();
           return res.status(200).json({ message: "New identity added successfully", statuscode: 200 });
       } else {
        return res.status(404).json({ message: "User not found", statuscode: 404 });
       }
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default userIdentity;
