import mongoose from 'mongoose';
import db1 from "../../db/conn.js"
const rateTypeSchema = new mongoose.Schema({

    rateTypeId : {
        type : String,
        default : ''
    },

    rateType : {
        type : String,
        default : ''
    },   
});
const amenityIcon = db1.model('adminratetype', rateTypeSchema);
export default amenityIcon;