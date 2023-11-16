import mongoose, { mongo } from "mongoose";
import db1 from "../db/conn.js";

const confirmBookingDetails = new mongoose.Schema({
    bookingId :{
        type:String,
        default:""
    },

    guestId:{
        type:String,
        default:""
    },

    propertyId:{
        type:String,
        default:""
    },

    salutation :{
        type:String,
        default:""
    },

    guestName:{
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

    phoneNumber:{
        type:String,
        default:""
    },

    emailAddress:{
        type:String,
        default:""
    },

    reservationNumber :{
        type:String,
        default:""
    },

    reservationId :{
        type:String,
        default:""
    },

    roomTypeId :{
        type:String,
        default:""
    }

})

const bookingDetails = db1.model("ConfirmBookingDetails",confirmBookingDetails)
export default bookingDetails