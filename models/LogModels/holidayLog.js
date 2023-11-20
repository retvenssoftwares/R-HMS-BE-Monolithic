import mongoose from 'mongoose';
import db2 from "../../db/conn2.js";
const holidayLogModel = new mongoose.Schema({

    propertyId: {
        type: String,
        default: ''
    },

    holidayId: {
        type: String,
        default: ''
    },

    shortCode: [{
        shortCode: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        },
        modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
    }],
    displayStatus: [{
      displayStatus: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        },
        modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
    }],

    holidayName: [{
        holidayName: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        },
        modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
    }],

    startDate: [{
        startDate: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        },
        modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
    }],

    endDate: [{
        endDate: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        },
        modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
    }],

    createdBy: {
        type: String,
        default: ''
    },

    createdOn: {
        type: String,
        default: ''
    },

    modifiedBy: [{
        modifiedBy: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        },
        modifiedOn: {
            type: String,
            default: "",
          },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
    }],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
        },
        logId: {
            type: String,
            default: ''
        },
          userId: {
            type: String,
            default: "",
          },
          ipAddress: {
            type: String,
            default: "",
          },
          deviceType: {
            type: String,
            default: "",
          },
    }],


}, {
    versionKey: false
});

const holidayLog = db2.model('holidayLogModel', holidayLogModel);

export default holidayLog;