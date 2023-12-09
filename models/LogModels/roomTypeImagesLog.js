import { Schema, model } from "mongoose";
import db2 from "../../db/conn2.js";
const roomImage = Schema({

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
            createdOn: {type: String, default: ''},
            logId:{type: String, default:""},
            userId:{type: String, default:""},
            deviceType:{type: String, default:""},
            ipAddress:{type: String, default:""},
            modifiedOn: {type: String, default:""}
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
        modifiedDate: {type: String, default: ''},
        logId:{type: String, default:""},
        userId:{type: String, default:""},
        deviceType:{type: String, default:""},
        ipAddress:{type: String, default:""},
        modifiedOn: {type: String, default:""}

    }]
    
});

const roomImagesLog = db2.model("roomImagesLog", roomImage)
export default roomImagesLog
