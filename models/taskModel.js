import mongoose from "mongoose"
import db1 from "../db/conn.js"

const taskTypeSchema = new mongoose.Schema({

    propertyId: { type: String, default: "" },

    displayStatus: [{ displayStatus: { type: String, default: '1', enum: ['0', '1'], }, logId: { type: String, default: "" } }],

    taskId: { type: String, default: '' },

    taskType: [{
        taskType: { type: String, default: '' },
        logId: { type: String, default: '' },
    }],

    taskName: [{
        taskName: { type: String, default: '' },
        logId: { type: String, default: '' },
    }],

    roomId: [{
        roomId: { type: String, default: '' },
        logId: { type: String, default: '' },
    }],
    
    floorId: [{
        floorId: { type: String, default: '' },
        logId: { type: String, default: '' },
    }],

    taskDescription: [{
        taskDescription: { type: String, default: '' },
        logId: { type: String, default: '' },
    }],

    time: [{
        time: { type: String, default: '' },
        logId: { type: String, default: '' },
    }],

    dueOn: [{
        dueOn: { type: String, default: '' },
        logId: { type: String, default: '' },
    }],

    priority: [{
        priority: { type: String, default: '' },
        logId: { type: String, default: '' },
    }],

    taskStatus: [{
        taskStatus: { type: String, default: 'pending' },
        logId: { type: String, default: '' },
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

    assignedTo: [{
        assignedTo: [{
            assignedTo: { type: String, default: 'unassigned' },
            logId: { type: String, default: '' },
        }],
    }]
}, {
    versionKey: false
});
const taskTypesModel = db1.model("taskType", taskTypeSchema)
export default taskTypesModel;