import mongoose, { Schema, model } from "mongoose";

const roomType = new mongoose.Schema({

    roomTypeId:{
        type:String,
        default:"",
    },
    propertyId:{
        type:String,
        default:"",
    },
    shortCode:{
        type:String,
        default:"",
    },
    roomDescription:[{
      roomDescription:{
        type:String,
        default:"",
      },
      modifiedDate: {
        type: String,
        default: ""
    }

    }],
    roomTypeName:[{
        roomTypeName:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }

    }],
    maxAdult:[{
        maxAdult:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    maxChild:[{
        maxChild:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    maxOccupancy:[{
        maxOccupancy:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    roomRate:[{
        roomRate:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    extraAdultRate:[{
        extraAdultRate:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    extraChildRate:[{
        extraChildRate:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    
    





})

const roomTypeModel = mongoose.model("roomType", roomType)
export default roomTypeModel