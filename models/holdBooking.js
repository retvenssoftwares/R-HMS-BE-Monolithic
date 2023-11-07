import mongoose from "mongoose";
import db1 from "../db/conn.js"
const holdDetails = new mongoose.Schema({

    guestId :{
        type:String,
        default:""
    },

    reservationId:{
        type:String,
        default:""
    },

    propertyId:{
        type:String,
        default:""
    },

    bookingId : {
        type:String,
        default:""
    },

    roomTypeId:{
        type:String,
        default:""
    },

    checkInDate:{
        type:String,
        default:""
    },

    checkOutDate:{
        type:String,
        default:""
    },

    bookingTime:{
        type:String,
        default:""
    },

    inventory:{
        type:Number,
        default:0
    },


})

const holdData = db1.model("hold", holdDetails)
export default holdData