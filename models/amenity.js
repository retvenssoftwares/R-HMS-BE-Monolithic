import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema({

    propertyId: {
        type: String,
        default: ''
    },

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

    amenityShortCode: {
        type: String,
        default: ''
    },

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
const amenity = model('amenity', amenitySchema);
export default amenity;