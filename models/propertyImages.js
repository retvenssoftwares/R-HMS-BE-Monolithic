import { Schema, model } from "mongoose";

const propertyImageSchema = Schema({

    propertyId: { type: String, default: '', unique: false },

    propertyImages: [
        {
            imageId: {type: String, default:''},
            image: { type: String, default: '' },
            displayStatus: {type:String, default: '1' }
        }
    ]

});

const propertyImageModel = model("propertyImages", propertyImageSchema)
export default propertyImageModel