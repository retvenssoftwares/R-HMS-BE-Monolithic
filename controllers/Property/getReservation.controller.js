import reservation from '../../models/reservationType.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from '../../helpers/helper.js';

const getReservation = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllReservation = await reservation.find({ propertyId });

            if (findAllReservation.length > 0) {
                const convertedReservation = findAllReservation.map(reservations => {
                    const convertedDateUTC = convertTimestampToCustomFormat(reservations.createdOn, targetTimeZone);
                    var convertedModifiedOn = ''
                    if (reservations.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(reservations.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    return {
                        ...reservations._doc,
                        createdOn: convertedDateUTC,
                        reservationName: reservations.reservationName[0].reservationName || {},
                        status: reservations.status[0].status || {},
                        modifiedBy: reservations.modifiedBy[0].modifiedBy || {},
                        modifiedOn: convertedModifiedOn,
                    };
                });

                return res.status(200).json({ data: convertedReservation, statuscode: 200 });
            } else {
                return res.status(404).json({ error: "No reservations found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getReservation;
