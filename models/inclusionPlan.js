import mongoose, { Mongoose,Schema, model } from "mongoose";

const inclusionPlan = new mongoose.Schema({
    inclusionPlanName:{
        type:String,
        default:""
    },
    shortCode:{
        type:String,
        default:""
    },
    inclusionPlaneId:{
        type:String,
        default:""
    },
    inclusionPlanNameArray:[[{
        inclusionId:{
            type:String,
            default:""
        },
        inclusionName:{
            type:String,
            default:""
        },
        postingRule:{
            type:String,
            default:""
        },
        chargeRule:{
            type:String,
            default:""
        },
        inclusionType:{
            type:String,
            default:""
        },
        price:{
            type:String,
            default:""
        }
    }],
    {
        versionKey: false
    },
   ],
    
})

const inclusionPlanModel = new mongoose.model("inclusionPlan",inclusionPlan)
export default inclusionPlanModel