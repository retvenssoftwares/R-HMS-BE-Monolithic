import mongoose from "mongoose";
import db1 from "../db/conn.js";

const accountTypeSchema =  new mongoose.Schema({
      
    accountTypeId : {
        type : String,
        default : ''
    },
    
    accountType : {
        type : String,
        default : ''
    },

});

const accountTypes = db1.model('accountType', accountTypeSchema);

export default accountTypes;