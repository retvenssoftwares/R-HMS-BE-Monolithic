import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema({

    propertyId: {
        type: String,
        default: ''
    },

    amenityName: {
        type: String,
        default: ''
    },

    amenityShortCode: {
        type: String,
        default: ''
    },

    amenityType: {
        type: String,
        default: ''
    },

    amenityIcon: {
        type: String,
        default: ''
    },

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