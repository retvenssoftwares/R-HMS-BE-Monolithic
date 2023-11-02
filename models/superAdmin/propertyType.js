import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const propertyTypeSchema =  new mongoose.Schema({
      
    propertyTypeId : {
        type : String,
        default : ''
    },
    
    propertyType : {
        type : String,
        default : ''
    },

});

const propertyType = db1.model('propertyType', propertyTypeSchema);

export default propertyType;