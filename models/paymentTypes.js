import { Schema, model, mongoose } from 'mongoose';

const paymentTypeSchema = new mongoose.Schema({

    shortCode: {
        type: String,
        default: ''
    },

    paymentTypeId: {
        type: String,
        default: ''
    },
    receivedTo: [{
        receivedTo: {
            type: String,
            default: ''
        }
    }],
    propertyId: {
        type: String,
        default: ''
    },

    paymentMethodName: [{
        paymentMethodName: {
            type: String,
            default: ''
        }
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
        }
    }],

    modifiedOn: [{
        modifiedOn: {
            type: String,
            default: ''
        }
    }],

});

const payment = model('paymentType', paymentTypeSchema);
export default payment;