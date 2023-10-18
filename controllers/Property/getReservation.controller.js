import * as dotenv from "dotenv";
dotenv.config();
import reservationModel from "../../models/reservationType.js";
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
  try {
    const { targetTimeZone } = req.query;
    const propertyId = req.params.propertyId;

    const reservationType = await reservationModel.find({
      propertyId: propertyId,
    });

    if (reservationType.length > 0) {
      // Assuming userTimeZone holds the user's specified time zone
      const convertedReservation = reservationType.map((reservation) => {
        if (reservation.reservationType.length > 0) {
          // Convert the dateUTC to the user's time zone
          const convertedDateUTC = convertTimestampToCustomFormat(
            reservation.dateUTC,
            targetTimeZone
          );
          const convertedDateCreatedOn = convertTimestampToCustomFormat(
            reservation.createdOn,
            targetTimeZone
          );
          const zeroPositionObject = reservation.reservationType[0];
          if (zeroPositionObject.modifiedOn) {
            // Convert the modifiedOn in the zero position object
            zeroPositionObject.modifiedOn = convertTimestampToCustomFormat(
              zeroPositionObject.modifiedOn,
              targetTimeZone
            );
          }
          // Include the converted date and modifiedOn in the property object
          return {
            ...reservation._doc,
            dateUTC: convertedDateUTC,
            createdOn: convertedDateCreatedOn,
            reservationType: [zeroPositionObject],
          };
        }
        return {
          ...reservation._doc,
          dateUTC: null,
          createdOn: null,
          reservationType: [],
        };
      });

      return res
        .status(200)
        .json({ reservation: convertedReservation, statuscode: 200 });
    } else {
      return res
        .status(404)
        .json({ error: "No property found", statuscode: 404 });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, statusCode: 500 });
  }
};

export default userProperty;
