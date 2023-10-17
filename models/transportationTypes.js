import mongoose, { Schema, model } from "mongoose";

const transportation = new Schema({
    transportationId:{
        type:String,
        default:""
    },
    shortCode :{
        type:String,
        default:""
    },
    roomTypeName:{
        type:String,
        default:""
    },
    createdBy:{
        type:String,
        default:""
    },
    createdOn:{
        type:String,
        default:""
    },
    lastModified:{
        type:String,
        default:""
    }
})

const transportationModel = mongoose.model("transportation",transportation)
export default transportationModel