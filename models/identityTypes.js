import mongoose from 'mongoose';
import db1 from "../db/conn.js"
const identityTypeSchema = new mongoose.Schema({
        
    shortCode : {
        type: String,
        default : ''
    },

    createdBy: {
        type : String,
        default : ''
    },

    createdOn : {
        type : String,
        default : ''
    },

    modifiedBy : [{
        modifiedBy : {
        type : String,
        default : ''
        }
    }],

    modifiedOn : [{
        modifiedOn : {
        type : String,
        default : ''
        }
    }],

    identityType : [{
        identityType : {
            type : String,
            default : ''
        }
    }],

    propertyId : {
        type : String,
        default : ''
    },

    identityTypeId : {
        type : String,
        default : ''
    },

});    

const identity = db1.model('identityType', identityTypeSchema);
export default identity;