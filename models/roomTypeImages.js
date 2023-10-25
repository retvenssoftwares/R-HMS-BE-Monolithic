import { Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const RoomSchema = Schema({

    roomTypeId : {
        type : String,
        default : ''
    },
    propertyId : {
        type : String,
        default : ''
    },
    Room: [
        {
            imageId: {type: String, default:''},
            image: { type: String, default: '' },
            displayStatus: {type:String, default: '1' },  
        },
    ],
    View: [
        {
            imageId: {type: String, default:''},
            image: { type: String, default: '' },
            displayStatus: {type:String, default: '1' },
            
        }

    ],
    bathRoom: [
        {
            imageId: {type: String, default:''},
            image: { type: String, default: '' },
            displayStatus: {type:String, default: '1' },
            
        },
    ],
    bed: [
        {
            imageId: {type: String, default:''},
            image: { type: String, default: '' },
            displayStatus: {type:String, default: '1' },   
        }

    ],


});

const propertyRoomModel = db1.model("roomimages", RoomSchema)
export default propertyRoomModel
