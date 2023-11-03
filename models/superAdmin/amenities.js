import mongoose from 'mongoose';
import db1 from "../../db/conn.js"
const amenitySchema = new mongoose.Schema({
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
const amenities = db1.model('adminamenities', amenitySchema);
export default amenities;