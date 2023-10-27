import mongoose from "mongoose";
import db1 from "../db/conn.js";

const bedTypeSchema =  new mongoose.Schema({
      
     bedTypeId : {
        type : String,
        default : ''
     },

     bedType : {
        type : String,
        default : ''
     },

});

const bedTypes = db1.model('bedType', bedTypeSchema);

export default bedTypes;