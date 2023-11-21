import mongoose from "mongoose";
import db1 from "../../db/conn.js";

const basicCurrencyModel= new mongoose.Schema({

    basicCurrency:{
        type:String,
        default:''
    },
    basicCurrencyId:{
        type:String,
        default:''
    }
},  {
    versionKey: false,
  })

const currencyModel=db1.model('basicCurrencyModel',basicCurrencyModel)
export default currencyModel;