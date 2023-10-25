import * as dotenv from "dotenv";
dotenv.config();
import postingRulesModel from "../../models/postingRules.js";

const postingRulesModels = async (req, res) => {
       try{
         

       }catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};
export default postingRulesModels;