import mongoose, { Schema, model } from "mongoose";

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
const ratePlanSchema = mongoose.model("RatePlan",ratePlan)
export default ratePlanSchema
