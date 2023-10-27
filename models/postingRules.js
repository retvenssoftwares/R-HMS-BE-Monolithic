import mongoose from 'mongoose';
import db1 from "../db/conn.js"

const postingRulesSchema = new mongoose.Schema({

        postingRuleId: {
          type : String,
          default : ''
        },
        
        postingRule : {
         type : String,
         default : ''
        },

        

});     
const postingRule = db1.model('postingRules', postingRulesSchema);

export default postingRule;