import mongoose, { Mongoose,Schema, model } from "mongoose";
import db1 from "../db/conn.js"
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

const inclusionPlanModel = db1.model("inclusionPlan",inclusionPlan)
export default inclusionPlanModel