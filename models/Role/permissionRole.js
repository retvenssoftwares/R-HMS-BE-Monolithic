const mongoose = require("mongoose")
const randomstring = require("randomstring")

const roleSchmea = new mongoose.Schema({
    roleName : {type : String , default :""},
    // permissionsId : {type : String , default:randomstring.generate(10)},
    permissionTypeName : {type : String , default :""},
    permissionShortKey : {type : String , default :""},
    permissionsName :[{
        subPermissionId : {type : String , default :""},
        subPermission : {type : String , default : ""},
    }]
})

const roledata = mongoose.model("permissionRole",roleSchmea);
module.exports = roledata;
