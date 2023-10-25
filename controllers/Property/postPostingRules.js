import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import postingModel from "../../models/postingRules.js";
// import verifiedUser from "../../models/verifiedUsers.js";
//import { getCurrentUTCTimestamp } from '../../helpers/helper.js'

const postingRule = async (req , res) =>{
     try{

        const {
            postingRuleId,
            postingRule,
            
        }= req.body;
          
        const newPosting = new postingModel({
            postingRuleId : Randomstring.generate(8),
            postingRule, 
              
                            
        });
        await newPosting.save();

        return res.status(200).json({ message: "New postingRule added successfully", statuscode: 200 });
    
     }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default postingRule;