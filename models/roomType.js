import mongoose, { Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const roomType = new mongoose.Schema({


    userId:{
        type:String,
        default:"", 
    },
    roomTypeId:{
        type:String,
        default:"",
    },
    propertyId:{
        type:String,
        default:"",
    },
  
    dateUTC: {
        type: String
    },
    dateLocal: {
        type: String
    },

    createdBy:{
        type:String,
        default:""
    },
    createdOn:{
        type:String,
        default:""
    },

shortCode:[{
    shortCode:{
        type:String,
        default:"",
    },
    logId:{
        type:String,
        default:"",

    },
   


}],
 
    roomDescription:[{
      roomDescription:{
        type:String,
        default:"",
      },
      logId: {
        type: String,
        default: ""
    }

    }],

    numberOfRooms:[{
        numberOfRooms:{
            type:String,
            default:"",
        },

        logId:{
            type:String,
            default:"", 
        }
    }],

    roomTypeName:[{
        roomTypeName:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }

    }],

    noOfBeds:[{
        noOfBeds:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }

    }],



    bedType:[{
        bedType:[{
            bedTypeId:{
            type:String,
            default:"",
            }
        }],
        logId: {
            type: String,
            default: ""
        }

    }],

    baseAdult:[{
        baseAdult:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }

    }],
    baseChild:[{
        baseChild:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }

    }],


    maxAdult:[{
        maxAdult:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }
    }],

    maxChild:[{
        maxChild:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }
    }],

    maxOccupancy:[{
        maxOccupancy:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }
    }],

   


    baseRate:[{
        baseRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }
    }],

    minimumRate:[{
        minimumRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }
    }],

    maximumRate:[{
        maximumRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }
    }],
    extraAdultRate:[{
        extraAdultRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }
    }],
    extraChildRate:[{
        extraChildRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        }
    }],

    amenities: [{
        amenities:[{
        amenityId: {
            default: "",
            type: String
        },
        addedDate:String
    }],
    logId: {
        type: String,
        default: ""
    },
}],

})

const roomTypeModel = db1.model("roomType", roomType)
export default roomTypeModel