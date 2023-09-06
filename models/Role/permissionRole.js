const mongoose = require("mongoose")
const randomstring = require("randomstring")

const roleSchmea = new mongoose.Schema({
    roleName : {type : String , default :""},
    permissions :[{
        subPermissionId : {type : String, default : ""},
        subPermission : {type : String , default : ""},
    }]
})

const roledata = mongoose.model("permissionRole",roleSchmea);
module.exports = roledata;
