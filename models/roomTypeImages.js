import { Schema, model } from "mongoose";

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

const propertyRoomModel = model("roomimages", RoomSchema)
export default propertyRoomModel
