import ReservationType from "../../models/reservationType.js";
import {
    getCurrentUTCTimestamp,
    getCurrentLocalTimestamp,
} from "../../helpers/helper.js";
import mongoose from "mongoose"; // Import mongoose to use isValidObjectId

const updateProperty = async (req, res) => {
    const reservationTypeId = req.params.reservationId;
    const { reservationName, status, modifiedBy } = req.body;
    const currentUTCTime = await getCurrentUTCTimestamp();

    try {
        // Check if the reservationTypeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(reservationTypeId)) {
            return res.status(400).json({ message: "Invalid reservationTypeId" });
        }

        // Find the reservation document by its ID
        const reservation = await ReservationType.findById(reservationTypeId);

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Check if reservationType array exists and is not empty
        if (!reservation.reservationType || reservation.reservationType.length === 0) {
            // If it's empty or doesn't exist, create a new array with one object
            reservation.reservationType = [{
                reservationName,
                status,
                modifiedBy,
                modifiedOn: currentUTCTime,
            }];
        } else {
            // Update the first object in the array
            reservation.reservationType[0].reservationName = reservationName;
            reservation.reservationType[0].status = status;
            reservation.reservationType[0].modifiedBy = modifiedBy;
            reservation.reservationType[0].modifiedOn = currentUTCTime;
        }

        // Save the updated document
        await reservation.save();

        return res.status(200).json({ message: "Reservation updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default updateProperty;
