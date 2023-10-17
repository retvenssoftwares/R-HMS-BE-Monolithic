import { Schema, model } from "mongoose";

const reservationTypeSchema = Schema({

    propertyId: { type: String, default: '', unique: false },
    reservationTypeId: {type: String, default:''},
    dateUTC: {
        type: String
    },
    dateLocal: {
        type: String
    },
    reservationType: [
        {
            
            reservationName: { type: String, default: '' },
            status: {type:String, default: '' },
            createdBy:{type:String,default:''},
            createdOn:{type:String,default:''},
            modifiedBy:{type:String,default:''},
            modifiedOn:{type:String,default:''},
        }
    ]

});

const reservationModel = model("reservationType", reservationTypeSchema)
export default reservationModel