import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const designationSchema =  new mongoose.Schema({
      
    designationId : {
        type : String,
        default : ''
     },

     designation : {
        type : String,
        default : ''
     },

});

const designationType = db1.model('designation', designationSchema);

export default designationType;