import mongoose from "mongoose"
import db1 from "../db/conn.js"

const discountTypeSchema = new mongoose.Schema({

    propertyId: { type: String, default: "" },
    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],

    discountTypeId: { type: String, default: "" },

    shortCode: [{
        shortCode: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    discountTypeName: [{
        discountTypeName: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    discountValue: [{
        discountValue: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    discountType: [{
        discountType: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    modifiedBy: [{
        modifiedBy: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    modifiedOn: [{
        modifiedOn: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    createdBy : { type: String, default: ''},
    createdOn: { type: String, default: ''},

    discountPercent: [{
        discountPercent: { type: String, default: ''},
        logId: { type: String, default: ''}
    }],

    discountPrice: [{
        discountPrice: { type: String, default: ''},
        logId: { type: String, default: ''}
    }],
}, {
    versionKey: false 
});
const discountTypesModel = db1.model("discountType", discountTypeSchema)
export default discountTypesModel;