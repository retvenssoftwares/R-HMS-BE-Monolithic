import mongoose from "mongoose";


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

const chargeRule = mongoose.model('chargeRules', chargeRulesSchema);

export default chargeRule;