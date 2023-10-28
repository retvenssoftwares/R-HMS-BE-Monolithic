import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const inclusionTypeSchema =  new mongoose.Schema({
      
     inclusionTypeId : {
        type : String,
        default : ''
     },

     inclusionType : {
        type : String,
        default : ''
     },

});

const inclusionTypes = db1.model('inclusionType', inclusionTypeSchema);

export default inclusionTypes;