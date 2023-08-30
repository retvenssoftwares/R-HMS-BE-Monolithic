const mongoose = require("mongoose");
const randomstring = require("randomstring");

const tax = new mongoose.Schema({

  taxId : {typeof:String , default : randomstring.generate(10)},

  taxName: {type: String, description: String, default : ""},

  description: {type: String, description: String, default :""},

  type: {type: String, description: String, default :""},

  rate: {type: String, description: String, default : ""},

  dueDate: {type: String, description: String, default :""},

  collectionAgency: {type: String, description: String , default :""},

  addedBy : {type: String, default :""},

  modifiedBy : {modifiedBy:{type: String, default :""}},

  modifiedDate : {modifiedDate:{type: String, default :""}},

  addedDate : {type: String, default :""},

  //required : [ description : String,  type ,  rate ,  applicableGoods ,  dueDate ,  collectionAgency ]

});

const taxType = new mongoose.model("taxDetails", tax);
module.export = taxType;
