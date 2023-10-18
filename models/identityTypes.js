import mongoose from 'mongoose';

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

const identity = mongoose.model('identityType', identityTypeSchema);
export default identity;