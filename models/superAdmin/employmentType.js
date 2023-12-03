import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const employmentTypeSchema =  new mongoose.Schema({
   
    employmentId: {
        type: String,
        default: ''
    },

    employmentTypeName: {
        type: String,
        default: ''
    },

    displayStatus: {
        type: String,
        default: '1',
        enum: ['0', '1'],
    },

});
const employmentType = db1.model('employmentType', employmentTypeSchema);

export default employmentType;