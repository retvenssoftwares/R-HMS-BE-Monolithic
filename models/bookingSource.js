import { Schema, model } from "mongoose";

const bookingSourceSchema = Schema({

    propertyId: { type: String, default: '', unique: false },
    bookingSourceId: {type: String, default:''},
    shortCode:{
        type:String
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

const bookingSourceModel = model("bookingSource", bookingSourceSchema)
export default bookingSourceModel