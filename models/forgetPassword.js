import mongoose from "mongoose";
import { getCurrentUTCTimestamp } from "../helpers/helper.js";
import db1 from "../db/conn.js";

const otp = new mongoose.Schema({
    otp : {
        type:String,
        default:""
    },

    time : {
        type:String,
        default:""
    }
})

const otpModel = db1.model("otp",otp)
export default otpModel