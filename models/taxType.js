import mongoose from "mongoose"
import db1 from "../db/conn.js"

const taxTypeSchema = new mongoose.Schema({
     
    userId: { type: String, default: ""},

    propertyId: { type: String, default: "" },

    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],
    
    taxId: { type: String, default: "" },

    taxTypeName: [{
        taxTypeName: { type: String, default: ''},
        logId: { type: String, default: ''}
    }],

    shortCode: [{
        shortCode: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    taxType: [{
        taxType: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    isSlabs: [{
        isSlabs: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    slabs: [{
        slabs: [{
          from: { type: String, default: ''},
          to: { type: String, default: ''},
          rate: { type: String, default: ''}, 
        }],
        logId: { type: String, default: ''}
    }],

    applyAfter: [{
        applyAfter: [{
            taxId : { type: String , default: ''}
        }],
        logId: { type: String, default: ''}
    }],

    taxRate: [{
        taxRate: { type: String, default: ''},
        logId: { type: String, default: ''}
    }],

    modifiedBy: [{
        modifiedBy: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    modifiedOn: [{
        modifiedOn: { type: String, default: '' },
        logId: { type: String, default: '' }
    }],

    createdBy: {
        type: String,
        default: ""
    },
    createdOn: {
        type: String,
        default: ""
    },
}, {
    versionKey: false 

});
const taxTypesModel = db1.model("taxType",taxTypeSchema)
export default taxTypesModel;