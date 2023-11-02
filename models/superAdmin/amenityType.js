import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const amenityTypeSchema =  new mongoose.Schema({
      
    amenityTypeId : {
        type : String,
        default : ''
    },
    
    amenityType : {
        type : String,
        default : ''
    },

});

const amenityTypes = db1.model('amenityType', amenityTypeSchema);

export default amenityTypes;