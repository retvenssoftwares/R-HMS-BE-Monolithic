import mongoose from "mongoose";

const guestDetails = new mongoose.Schema({
    guestId :{
        type:String,
        default:""
    },

    bookingId:{
        type:String,
        default:""
    },

    salutation:{
        type:String,
        default:""
    },

    guestName:{
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

    addressLine1:{
        type:String,
        default:""
    },

    addressLine2:{
        type:String,
        default:""
    },

    country:{
        type:String,
        default:""
    },

    state:{
        type:String,
        default:""
    },

    city:{
        type:String,
        default:""
    },

    pinCode:{
        type:String,
        default:""
    }
})