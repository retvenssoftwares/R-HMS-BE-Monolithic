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
    roomImages: [
        {
            imageId: {type: String, default:''},
            image: { type: String, default: '' },
            imageTags:[ {

            imageTags:[{
              
                type:String, default: ''
                
            }]
            }],
            displayStatus: {type:String, default: '1' },  
            createdOn: {type: String, default: ''}
        },
    ],
    deletedRoomImages:[{
        
        imageId: {type: String, default:''},
        image: { type: String, default: '' },
        imageTags:[ {

        imageTags:[{
          
            type:String, default: ''
            
        }]
        }],
        displayStatus: {type:String, default: '' },  
        modifiedDate: {type: String, default: ''}

    }]
    
});

const propertyRoomModel = db1.model("roomimages", RoomSchema)
export default propertyRoomModel
