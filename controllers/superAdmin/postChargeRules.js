import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import chargeRulesModel from "../../models/superAdmin/chargeRules.js";
import verifiedUser from "../../models/verifiedUsers.js";

const chargeRule = async (req , res) =>{
    try{

       const {
        
        chargeRuleId,
        chargeRule,

       }= req.body;
         
       const newCharge = new chargeRulesModel({
           chargeRuleId : Randomstring.generate(8),
           chargeRule,
            
            
       });
       await newCharge.save();

       return res.status(200).json({ message: "New chargeRule added successfully", statuscode: 200 });
   
    }catch(err){
       console.log(err);
       res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
   }
};

export default chargeRule;