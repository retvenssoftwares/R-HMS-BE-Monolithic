import ReservationType from "../../models/reservationType.js";
import {
    getCurrentUTCTimestamp,
    getCurrentLocalTimestamp,
} from "../../helpers/helper.js";
import userModel from '../../models/user.js'

const updateReservation = async (req, res) => {
    const reservationId = req.params.reservationId;
    const { reservationName, status, userId, modifiedBy } = req.body;
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
        // Find the reservation document by its reservationId
        const reservation = await ReservationType.findOne({ reservationTypeId: reservationId });

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Check if reservationType array exists and is not empty
        if (!reservation.reservationType || reservation.reservationType.length === 0) {
            // If it's empty or doesn't exist, create a new array with one object
            reservation.reservationType = [{
                reservationName,
                status,
                modifiedBy: userRole,
                modifiedOn: currentUTCTime,
            }];
        } else {
            // Push a new object at the beginning of the array
            reservation.reservationType.unshift({
                reservationName,
                status,
                modifiedBy:userRole,
                modifiedOn: currentUTCTime,
            });
        }

        // Save the updated document
        await reservation.save();

        return res.status(200).json({ message: "Reservation updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default updateReservation;
