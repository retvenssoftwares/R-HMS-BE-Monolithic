import * as dotenv from "dotenv";
dotenv.config();
import postingRulesModel from "../../models/superAdmin/postingRules.js";

const postingRulesModels = async (req, res) => {
       try{
        const postingRules = await postingRulesModel.find({}).select('postingRuleId postingRule -_id ').lean();
        return res.status(200).json({data:postingRules , statusCode: 200});

       }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default postingRulesModels;
