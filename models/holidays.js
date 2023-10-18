import { Schema, model } from "mongoose";

const holidaySchema = Schema({

    propertyId: { type: String, default: '', unique: false },
    holidayId: {type: String, default:''},
    shortCode:{
        type:String,
        default:''
    },

    dateUTC: {
        type: String,
        default:''
    },
    dateLocal: {
        type: String,
        default:''
    },
    createdBy:{type:String,default:''},
    createdOn:{type:String,default:''},
    holidayType: [
        {
            
            holidayName: { type: String, default: '' },
            startDate: { type: String, default: '' },
            endDate: { type: String, default: '' },
            modifiedBy:{type:String,default:''},
            modifiedOn:{type:String,default:''},
        }
    ]

});

const holidayModel = model("holidays", holidaySchema)
export default holidayModel