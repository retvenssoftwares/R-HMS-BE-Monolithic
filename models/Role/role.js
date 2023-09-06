const mongoose = require("mongoose")
const randomstring = require("randomstring")

const roleSchmea = new mongoose.Schema({
    roleName : {type : String , default :""},
    roleId : {type :String , default:randomstring.generate(10)},
})

const roledata = mongoose.model("role",roleSchmea);
module.exports = roledata;
