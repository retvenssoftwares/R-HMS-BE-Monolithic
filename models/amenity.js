import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema({

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
    
    amenityId: {
        type: String,
        default: ''
    },

    amenityName: [{
        amenityName: {
            type: String,
            default: ''
        }
    }],


    amenityType: [{
        amenityType: {
            type: String,
            default: ''
        }
    }],

    amenityIcon: [{
        amenityIcon: {
            type: String,
            default: ''
        }
    }],

    amenityIconLink: {
        type: String,
        default: ''
    },

},
    {
        versionKey: false
    }
);
const amenity = mongoose.model('amenity', amenitySchema);
export default amenity;