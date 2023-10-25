import mongoose, { Schema, model } from "mongoose";
import db1 from "../db/conn.js"
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
    propertyId:{
        type:String,
        default:""
    },
    updatedArray:[{
        roomTypeName:{
            type:String,
            default:""
        },
        propertyId:{
            type:String,
            default:""
        },
        lastModifiedBy:{
            type:String,
            default:""
        },
        lastModifiedOn:{
            type:String,
            default:""
        }

    }]
    
})

const transportationModel = db1.model("transportation",transportation)
export default transportationModel