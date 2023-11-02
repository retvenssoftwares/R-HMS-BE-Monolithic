import mongoose, { Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const ratePlan = new mongoose.Schema({
    ratePlanName:{
        type:String,
        default:""
    },
    shortCode:{
        type:String,
        default:""
    },
    roomType:{
        type:String,
        default:""
    },
    rateTypeId:{
        type:String,
        default:""
    },
    roomBaseRate:{
        type:String,
        default:""
    },
    perAdults:{
        type:String,
        default:""
    },
    perChild:{
        type:String,
        default:""
    },
    ratePlanTotal:{
        type:String,
        default:""
    }
})
const ratePlanSchema = db1.model("RatePlan",ratePlan)
export default ratePlanSchema
