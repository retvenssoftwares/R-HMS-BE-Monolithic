import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const departmentSchema =  new mongoose.Schema({
   
    departmentId: {
        type: String,
        default: ''
    },

    departmentName: {
        type: String,
        default: ''
    },

    displayStatus: {
        type: String,
        default: '',
        enum: ['0', '1'],
    },

});
const departmentType = db1.model('department', departmentSchema);

export default departmentType;