import mongoose, { Mongoose, Schema , model } from "mongoose";
import db1 from "../db/conn.js"
const businessSources = new mongoose.Schema({
    sourceId:{
        type:String,
        default:""
    },
    shortCode:{
        type:String,
        default:""
    },
    propertyId:{
        type:String,
        default:""
    },
    sourceName:{
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
    updatedArray:[{
        sourceName:{
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

const businessSourcesModel = db1.model("businessSources" , businessSources)
export default businessSourcesModel