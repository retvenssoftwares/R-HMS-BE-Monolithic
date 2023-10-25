import * as dotenv from "dotenv";
dotenv.config();
import chargeRuleModel from "../../models/chargeRules.js";

const getchargeRule = async (req, res) => {
      try{
        
        const chargeRules = await chargeRuleModel.find({});
       
        return res.status(200).json({hargeRule , statusCode})
      }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default getchargeRule;