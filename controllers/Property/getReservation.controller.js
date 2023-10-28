import reservation from '../../models/reservationType.js';
import { convertTimestampToCustomFormat, verifyUser } from '../../helpers/helper.js';

const getReservation = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await verifyUser(userId, authCodeValue);

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
                        reservationName: reservations.reservationName[0] || {},
                        status: reservations.status[0] || {},
                        modifiedBy: reservations.modifiedBy[0] || {},
                        modifiedOn: convertedModifiedOn,
                    };
                });

                return res.status(200).json({ data: convertedReservation, statuscode: 200 });
            } else {
                return res.status(404).json({ error: "No reservation found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default getReservation;
