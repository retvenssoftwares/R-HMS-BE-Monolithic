import bookingModel from "../../models/bookingSource.js";
import {
    getCurrentUTCTimestamp,
    getCurrentLocalTimestamp,
} from "../../helpers/helper.js";
import userModel from '../../models/verifiedUsers.js'

const updateBookingSource = async (req, res) => {
    const bookingSourceId = req.params.bookingSourceId;
    const { sourceName, userId, modifiedBy } = req.body;
    const authCodeValue = req.headers['authcode']
    const findUser = await userModel.findOne({ userId })

    if (!findUser) {
        return res.status(404).json({ message: "User not found" });
    }
    const {authCode}= findUser

    if(authCodeValue!==authCode){
        return res.status(404).json({message:"invalid authCode"})
      }

    const userRole = findUser.role[0].role;
    console.log(userRole)
    const currentUTCTime = await getCurrentUTCTimestamp();

    try {
        // Find the booking document by its bookingSourceId
        const booking = await bookingModel.findOne({ bookingSourceId: bookingSourceId });

        if (!booking) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Check if bookingSource array exists and is not empty
        if (!booking.bookingSource || booking.bookingSource.length === 0) {
            // If it's empty or doesn't exist, create a new array with one object
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

        // Save the updated document
        await booking.save();

        return res.status(200).json({ message: "booking Source updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default updateBookingSource;
