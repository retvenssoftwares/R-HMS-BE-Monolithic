import { Schema, model } from 'mongoose';
import db1 from '../../db/conn.js'
const bookingNotificationSchema = new Schema({
    otaId: {
        type: String,
        default: ''
    },
    propertyId: {
        type: String,
        default: ''
    },
    Booking: {
        bookingId: {
            type: String,
            default: ''
        },
        customerName: {
            type: String,
            default: ''
        },
        noOfRooms: {
            type: Number,
            default: 0
        },
        noOfNights: {
            type: Number,
            default: 0
        },
        roomTypeName: {
            type: String,
            default: ''
        },
        checkInDate: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            default: ''
        },
        payAtHotelFlag: {
            type: String,
            default: ''
        },
        bookingTime: {
            type: Date,
            default: ''
        },
        bookingVendorName: {
            type: String,
            default: ''
        }
    }

});

const BookingNotificationMMT = db1.model('bookingMMTNotifications', bookingNotificationSchema);
export default BookingNotificationMMT