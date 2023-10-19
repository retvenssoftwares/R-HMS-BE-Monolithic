import bookingModel from "../../models/bookingSource.js";
import {
    getCurrentUTCTimestamp,
    getCurrentLocalTimestamp,
} from "../../helpers/helper.js";
import userModel from '../../models/verifiedUsers.js';

const updateBookingSource = async (req, res) => {
    const bookingSourceId = req.params.bookingSourceId;
    const { sourceName, userId, modifiedBy, shortCode } = req.body;
    const authCodeValue = req.headers['authcode'];
    const findUser = await userModel.findOne({ userId: userId });

    if (!findUser) {
        return res.status(404).json({ message: "User not found" });
    }
    const { authCode } = findUser;

    if (authCodeValue !== authCode) {
        return res.status(404).json({ message: "Invalid authCode" });
    }

    const userRole = findUser.role[0].role;
    console.log(userRole);
    const currentUTCTime = await getCurrentUTCTimestamp();

    try {
        // Find the booking document by its bookingSourceId
        const booking = await bookingModel.findOne({ bookingSourceId: bookingSourceId });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if sourceName is provided in the request
        if (sourceName) {
            if (!booking.bookingSource || booking.bookingSource.length === 0) {
                // If the bookingSource array is empty or doesn't exist, create a new array with one object
                booking.bookingSource = [{
                    sourceName,
                    modifiedBy: userRole,
                    modifiedOn: currentUTCTime,
                }];
            } else {
                // Push a new object at the beginning of the array
                booking.bookingSource.unshift({
                    sourceName,
                    modifiedBy: userRole,
                    modifiedOn: currentUTCTime,
                });
            }
        }

        // Check if shortCode is provided in the request
        if (shortCode) {
            // Update the shortCode
            booking.shortCode = shortCode;
        }

        // Save the updated document
        await booking.save();

        return res.status(200).json({ message: "Booking Source updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default updateBookingSource;
