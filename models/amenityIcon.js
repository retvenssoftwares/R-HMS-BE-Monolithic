import mongoose from 'mongoose';

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
const amenityIcon = model('amenityIcon', amenityIconSchema);
export default amenityIcon;