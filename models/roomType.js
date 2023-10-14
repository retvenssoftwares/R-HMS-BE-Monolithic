import { Schema, model } from "mongoose";

const propertyRoomSchema = Schema({


propertyId: { type: String, default: '', unique: false },

    roomImages: [
        {
            imageId: {type: String, default:''},
            image: { type: String, default: '' },
            displayStatus: {type:String, default: '1' },
            imageDescription: {type: String, default: ''}
        }

    ],

    roomTypeId : {

        type : String,
        default : ''
    }

});

const propertyRoomModel = model("propertyRoomimages", propertyRoomSchema)
export default propertyRoomModel