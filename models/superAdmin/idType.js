import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const idTypeSchema =  new mongoose.Schema({
   
    idTypeId: {
        type: String,
        default: ''
    },

    idName: {
        type: String,
        default: ''
    },

    displayStatus: {
        type: String,
        default: '1',
        enum: ['0', '1'],
    },

});
const idTypeModel = db1.model('idType', idTypeSchema);

export default idTypeModel;