import reservation from '../../models/reservationType.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'

const patchReservation = async (req, res) => {
    try {
        const { userId, reservationName,status } = req.body;
        const reservationTypeId = req.params.reservationTypeId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
        const userToken = findUser.authCode;
        let userRole = findUser.role[0].role;

        if (authCodeValue !== userToken) {
            return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
        }

        const findReservation = await reservation.findOne({reservationTypeId: reservationTypeId });

        if (!findReservation) {
            return res.status(404).json({ message: "reservation not found", statuscode: 404 });
        }

      

        const currentUTCTime = await getCurrentUTCTimestamp();

        if (reservationName) {
            const reservationNameObject = {
                reservationName: reservationName
            };
            findReservation.reservationName.unshift(reservationNameObject);
        }

        if (status) {
            const statusObject = {
                status: status
            };
            findReservation.status.unshift(statusObject);
        }

        const modifiedByObject = {
            modifiedBy: userRole
        };

        findReservation.modifiedBy.unshift(modifiedByObject);
        findReservation.modifiedOn.unshift({ modifiedOn: currentUTCTime });

        const updatedReservation = await findReservation.save();

        if (updatedReservation) {
            return res.status(200).json({ message: "reservation successfully updated", statuscode:200 });
        } else {
            return res.status(404).json({ message: "reservation not found", statuscode: 404 });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode:500 });
    }
}

export default patchReservation;
