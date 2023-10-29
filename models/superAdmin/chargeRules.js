import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const chargeRulesSchema =  new mongoose.Schema({
           
      chargeRuleId : {
         type : String,
         default : ''
      },

      chargeRule :{
        type : String,
        default : ''
      },

});

const chargeRule = db1.model('chargeRules', chargeRulesSchema);

export default chargeRule;