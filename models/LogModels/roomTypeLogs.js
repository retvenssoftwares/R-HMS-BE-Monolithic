import mongoose, { Schema, model } from "mongoose";
import db2 from "../../db/conn2.js"
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
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    ipAddress: { type: String, default: "" },
    deviceType: { type: String, default: "" },


}],
 
    roomDescription:[{
      roomDescription:{
        type:String,
        default:"",
      },
      logId: {
        type: String,
        default: ""
    },
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    ipAddress: { type: String, default: "" },
    deviceType: { type: String, default: "" },

    }],
    roomTypeName:[{
        roomTypeName:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },

    }],

    noOfBeds:[{
        noOfBeds:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },

    }],



    bedType:[{
        bedType:[{
            type:String,
            default:"",
        }],
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },

    }],

    baseAdult:[{
        baseAdult:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },

    }],
    baseChild:[{
        baseChild:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },

    }],


    maxAdult:[{
        maxAdult:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],

    maxChild:[{
        maxChild:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],

    maxOccupancy:[{
        maxOccupancy:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],

   


    baseRate:[{
        baseRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],

    minimumRate:[{
        minimumRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],

    maximumRate:[{
        maximumRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],
    extraAdultRate:[{
        extraAdultRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
    }],
    extraChildRate:[{
        extraChildRate:{
            type:String,
            default:"",
        },
        logId: {
            type: String,
            default: ""
        },
        modifiedOn:{
            type: String,
            default: ""
        },
        userId:{
            type: String,
            default: ""
        },
        ipAddress: { type: String, default: "" },
        deviceType: { type: String, default: "" },
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
    modifiedOn:{
        type: String,
        default: ""
    },
    userId:{
        type: String,
        default: ""
    },
    ipAddress: { type: String, default: "" },
    deviceType: { type: String, default: "" },
    request: { type: String, default: '' },
    response: { type: String, default: '' },
}],

})

const roomTypeModel = db2.model("roomType", roomType)
export default roomTypeModel