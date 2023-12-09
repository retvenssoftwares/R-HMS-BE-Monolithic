import { Schema, model } from "mongoose";
import db2 from "../../db/conn2.js";
const propertyImagesLog = Schema({

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
            createdOn: {type: String, default: ''},
            logId:{type: String, default:""},
            userId:{type: String, default:""},
            deviceType:{type: String, default:""},
            ipAddress:{type: String, default:""},
            modifiedOn: {type: String, default:""}
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
            modifiedDate: {type: String, default: ''},
            // logId:{type: String, default:""},
            // userId:{type: String, default:""},
            // deviceType:{type: String, default:""},
            // ipAddress:{type: String, default:""},
            // modifiedOn: {type: String, default:""}
        }
    ]

});

const propertyImageLogModel = db2.model("propertyImagesLog", propertyImagesLog)
export default propertyImageLogModel