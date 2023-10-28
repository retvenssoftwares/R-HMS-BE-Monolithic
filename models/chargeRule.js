import  { Mongoose , Schema , model } from "mongoose";


const chargeRule  = new Mongoose.Schema({
    chargeRuleId:{
        type:String,
        default:""
    },
    chargeRuleNmae:{
        type:String,
        default:""
    }
},
{
    versionKey: false
})
const chargeRuleModel = new Mongoose.model("chargeRule",chargeRule)
export default chargeRuleModel