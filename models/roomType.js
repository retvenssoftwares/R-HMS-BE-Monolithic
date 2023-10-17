import mongoose, { Schema, model } from "mongoose";

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

    bedType:[{
        bedType:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }

    }],

    baseAdult:[{
        baseAdult:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }

    }],
    baseChild:[{
        baseChild:{
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

    baseRate:[{
        baseRate:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    minimumRate:[{
        minimumRate:{
            type:String,
            default:"",
        },
        modifiedDate: {
            type: String,
            default: ""
        }
    }],

    maximumRate:[{
        maximumRate:{
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

    amenities: [{
        amenities:[{
        amenityId: {
            default: "",
            type: String
        },
        addedDate:String
    }]
}],

})

const roomTypeModel = mongoose.model("roomType", roomType)
export default roomTypeModel