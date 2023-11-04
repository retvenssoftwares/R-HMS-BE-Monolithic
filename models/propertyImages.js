import { Schema, model } from "mongoose";
import db1 from "../db/conn.js"
const propertyImageSchema = Schema({

    propertyId: { type: String, default: '', unique: false },

    propertyImages: [
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
        }
    ],

    deletedPropertyImages: [
        {
            imageId: {type: String, default:''},
            image: { type: String, default: '' },
            imageTags:[ {

                imageTags:[{
                  
                    type:String, default: ''
                    
                }]
                }],
            displayStatus: {type:String, default: '1' },
            modifiedDate: {type: String, default: ''}
        }
    ]

});

const propertyImageModel = db1.model("propertyImages", propertyImageSchema)
export default propertyImageModel