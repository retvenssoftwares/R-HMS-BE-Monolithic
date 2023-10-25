import mongoose from 'mongoose';

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
const postingRule = mongoose.model('postingRules', postingRulesSchema);

export default postingRule;