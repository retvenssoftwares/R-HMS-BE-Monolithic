import * as dotenv from "dotenv";
dotenv.config();
import chargeRuleModel from "../../models/superAdmin/chargeRules.js";

const getchargeRule = async (req, res) => {
      try{
        const chargeRules = await chargeRuleModel.find({}).select('chargeRuleId  chargeRule -_id').lean();
        return res.status(200).json({data:chargeRules , statusCode: 200});
      }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default getchargeRule;