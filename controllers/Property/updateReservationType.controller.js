import Randomstring from 'randomstring'
import reservation from '../../models/reservationType.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import reservationLog from '../../models/LogModels/reservationLogs.js'

const patchReservation = async (req, res) => {
    try {
        const { userId } = req.query
        const { reservationName, status, displayStatus ,deviceType,ipAddress} = req.body;
        const reservationTypeId = req.query.reservationTypeId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });
        const userid = findUser.userId;

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        if (result.success) {
            let userRole = findUser.role[0].role;

            const findReservation = await reservation.findOne({ reservationTypeId: reservationTypeId });

            if (!findReservation) {
                return res.status(404).json({ message: "Reservation type not found", statuscode: 404 });
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
            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: Randomstring.generate(10)
                };
                findReservation.displayStatus.unshift(displayStatusObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole,
                logId: Randomstring.generate(10)
            };

            findReservation.modifiedBy.unshift(modifiedByObject);
            findReservation.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: Randomstring.generate(10) });

            const updatedReservation = await findReservation.save();

            if (updatedReservation) {

                //save data in reservation
                
                const findreservationLog = await reservationLog.findOne({reservationTypeId });

                if (findreservationLog){
                if (reservationName) {
                    const reservationNameObject = {
                        reservationName:updatedReservation.reservationName[0].reservationName,
                        logId:updatedReservation.reservationName[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findreservationLog.reservationName.unshift(reservationNameObject);
                }

                if (status) {
                    const statusObject = {
                        status:updatedReservation.status[0].status,
                        logId:updatedReservation.status[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findreservationLog.status.unshift(statusObject);
                }
                if (displayStatus) {
                    const displayStatusObject = {
                        displayStatus:updatedReservation.displayStatus[0].displayStatus,
                        logId:updatedReservation.displayStatus[0].logId,
                        userId:userid,
                        deviceType:deviceType,
                        ipAddress:ipAddress,
                        modifiedOn:currentUTCTime,
                    };
                    findreservationLog.displayStatus.unshift(displayStatusObject);
                }
    
            }
            await findreservationLog.save();

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
