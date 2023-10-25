import { Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const bookingSourceSchema = Schema({

    propertyId: { type: String, default: '', unique: false },
    bookingSourceId: {type: String, default:''},

    shortCode:{
        type:String,
        default:''
    },
    dateUTC: {
        type: String
    },
    dateLocal: {
        type: String
    },
    createdBy:{type:String,default:''},
    createdOn:{type:String,default:''},
    bookingSource: [
        {
            
            sourceName: { type: String, default: '' },
            modifiedBy:{type:String,default:''},
            modifiedOn:{type:String,default:''},
           
        }
    ]

});

const bookingSourceModel = db1.model("bookingSource", bookingSourceSchema)
export default bookingSourceModel