import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";

const userProperty=async(req , res)=>{
try{
    const userId  =  req.params.userId

    const userProperties = await propertyModel.find({userId:userId})

    if(userProperties.length>0){

        
           return res.status(200).json({userProperties, statuscode : 200})
    } else {
          res.status(404).json({ error: "no property found", statuscode: 404 })

    }
}catch(error){
    res.status(500).json({ error: error.message, statusCode: 500 })
}
};  
export default userProperty;