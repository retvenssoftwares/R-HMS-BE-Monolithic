import mongoose from 'mongoose';
import db1 from "../db/conn.js"
const amenityIconSchema = new mongoose.Schema({

    amenityIconId : {
        type : String,
        default : ''
    },

    amenityIconLink : {
        type : String,
        default : ''
    },

    amenityIconTags : {type: String, default: ''}
    
    
});
const amenityIcon = db1.model('amenityIcon', amenityIconSchema);
export default amenityIcon;