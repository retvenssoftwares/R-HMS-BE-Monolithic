import mongoose from 'mongoose';
import db1 from '../db/conn.js'

const blockedRoomsSchema = new mongoose.Schema({
    propertyId: { type: String, default: '' },
    roomTypeId: { type: String, default: '' },
    blockedRooms: [{
        roomId: { type: String, default: '' },
        reason: { type: String, default: '' },
        date: { type: String, default: '' },
        status: { type: String, default: '' },
        modifiedOn: { type: String, default: '' }
    }]
}, {
    versionKey: false
});

const blockedRoomsModel = db1.model('blockedrooms', blockedRoomsSchema);
export default blockedRoomsModel
