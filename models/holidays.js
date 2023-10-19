import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema({

    propertyId: {
        type: String,
        default: ''
    },

    holidayId: {
        type: String,
        default: ''
    },

    shortCode: {
        type: String,
        default: ''
    },

    holidayName: [{
        holidayName: {
            type: String,
            default: ''
        },
    }],

    startDate: [{
        startDate: {
            type: String,
            default: ''
        },
    }],

    endDate: [{
        endDate: {
            type: String,
            default: ''
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
    }],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
        },
    }],

   


});

const holiday = mongoose.model('holiday', holidaySchema);

export default holiday;