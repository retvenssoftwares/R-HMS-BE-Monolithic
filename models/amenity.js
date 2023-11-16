import mongoose from 'mongoose';
import db1 from "../db/conn.js"
const amenitySchema = new mongoose.Schema({

  
    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],
    propertyId: {
        type: String,
        default: ''
    },

    createdBy: {
        type: String,
        default: ''
    },

    createdOn: {
        type: String,
        default: ''
    },

    modifiedBy: [{
        modifiedBy: {
            type: String,
            default: ''
        }
    }],

    shortCode:[{
    shortCode: {
        type: String,
        default: ''
    },
}],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
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

    amenityIconLink: [{
        amenityIconLink: {
            type: String,
            default: ''
        }
    }],

},
    {
        versionKey: false
    }
);
const amenity = db1.model('amenity', amenitySchema);
export default amenity;