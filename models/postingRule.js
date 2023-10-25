import  { Mongoose , Schema , model } from "mongoose";


const postingRule  = new Mongoose.Schema({
    postingRuleId:{
        type:String,
        default:""
    },
    postingRuleNmae:{
        type:String,
        default:""
    }
},
{
    versionKey: false
})
const postingRuleModel = new Mongoose.model("postingRule",postingRule)
export default postingRuleModel