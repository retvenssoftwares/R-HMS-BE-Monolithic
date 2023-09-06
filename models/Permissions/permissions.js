const mongoose = require("mongoose")
const randomstring = require("randomstring");

const permissions = new mongoose.Schema({
  
    permissionsId : {type : String , default:""},
    permissionTypeName : {type : String , default :""},
    permissionShortKey : {type : String , default :""},

    permissionName :[{
        subPermissionId : {type : String , default :""},
        subPermission : {type : String , default : ""},
    }]
    
})  

const permissionsdata = mongoose.model("permissions",permissions);
module.exports = permissionsdata;