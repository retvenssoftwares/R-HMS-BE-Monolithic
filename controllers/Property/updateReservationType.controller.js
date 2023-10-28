import Randomstring from 'randomstring'
import reservation from '../../models/reservationType.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'

const patchReservation = async (req, res) => {
    try {
        const { userId } = req.query
        const { reservationName, status } = req.body;
        const reservationTypeId = req.query.reservationTypeId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            let userRole = findUser.role[0].role;

            const findReservation = await reservation.findOne({ reservationTypeId: reservationTypeId });

            if (!findReservation) {
                return res.status(404).json({ message: "reservation not found", statuscode: 404 });
            }

            const currentUTCTime = await getCurrentUTCTimestamp();

            if (reservationName) {
                const reservationNameObject = {
                    reservationName: reservationName,
                    logId: Randomstring.generate(10)
                };
                findReservation.reservationName.unshift(reservationNameObject);
            }

            if (status) {
                const statusObject = {
                    status: status,
                    logId: Randomstring.generate(10)
                };
                findReservation.status.unshift(statusObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole,
                logId: Randomstring.generate(10)
            };

            findReservation.modifiedBy.unshift(modifiedByObject);
            findReservation.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: Randomstring.generate(10) });

            const updatedReservation = await findReservation.save();

            if (updatedReservation) {
                return res.status(200).json({ message: "reservation successfully updated", statuscode: 200 });
            } else {
                return res.status(404).json({ message: "reservation not found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default patchReservation;
