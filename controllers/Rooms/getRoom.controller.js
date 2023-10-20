import * as dotenv from "dotenv";
dotenv.config();
import roomModel from "../../models/roomType.js";
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
    try {
        const { targetTimeZone } = req.query;
        const propertyId = req.params.propertyId;

        const rooms = await roomModel.find({ propertyId: propertyId });

        if (rooms.length > 0) {
            // Map and modify each room object to only include the first element of the arrays
            const convertedProperties = rooms.map(room => {
                // Convert the dateUTC to the user's time zone
                const convertedDateUTC = convertTimestampToCustomFormat(room.dateUTC, targetTimeZone);

                // Access the first element of each array
                const firstRoomDescription = room.roomDescription[0];
                const firstRoomTypeName = room.roomTypeName[0];
                const firstBedType = room.bedType[0];
                const firstBaseAdult = room.baseAdult[0];
                const firstBaseChild = room.baseChild[0];
                const firstMaxAdult = room.maxAdult[0];
                const firstMaxChild = room.maxChild[0];
                const firstMaxOccupancy = room.maxOccupancy[0];
                const firstBaseRate = room.baseRate[0];
                const firstMinimumRate = room.minimumRate[0];
                const firstMaximumRate = room.maximumRate[0];
                const firstExtraAdultRate = room.extraAdultRate[0];
                const firstExtraChildRate = room.extraChildRate[0];
                const firstAmenities = room.amenities[0];
                // Include the converted date and first elements in the property object

                    
                        // Convert modifiedOn to the user's time zone (if modifiedOn exists)
                if (firstRoomDescription && firstRoomDescription.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstRoomDescription.modifiedDate, targetTimeZone);
                    firstRoomDescription.modifiedDate = convertedModifiedOn;
                }

                if (firstRoomTypeName && firstRoomTypeName.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstRoomTypeName.modifiedDate, targetTimeZone);
                    firstRoomTypeName.modifiedDate = convertedModifiedOn;
                }

                if (firstBedType && firstBedType.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstBedType.modifiedDate, targetTimeZone);
                    firstBedType.modifiedDate = convertedModifiedOn;
                }

                if (firstBaseAdult && firstBaseAdult.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstBaseAdult.modifiedDate, targetTimeZone);
                    firstBaseAdult.modifiedDate = convertedModifiedOn;
                }

                if (firstBaseChild && firstBaseChild.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstBaseChild.modifiedDate, targetTimeZone);
                    firstBaseChild.modifiedDate = convertedModifiedOn;
                }

                if (firstMaxAdult && firstMaxAdult.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstMaxAdult.modifiedDate, targetTimeZone);
                    firstMaxAdult.modifiedDate = convertedModifiedOn;
                }

                if (firstMaxChild && firstMaxChild.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstMaxChild.modifiedDate, targetTimeZone);
                    firstMaxChild.modifiedDate = convertedModifiedOn;
                }

                if (firstMaxOccupancy && firstMaxOccupancy.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstMaxOccupancy.modifiedDate, targetTimeZone);
                    firstMaxOccupancy.modifiedDate = convertedModifiedOn;
                }

                if (firstBaseRate && firstBaseRate.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstBaseRate.modifiedDate, targetTimeZone);
                    firstBaseRate.modifiedDate = convertedModifiedOn;
                }

                if (firstMinimumRate && firstMinimumRate.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstMinimumRate.modifiedDate, targetTimeZone);
                    firstMinimumRate.modifiedDate = convertedModifiedOn;
                }

                if (firstMaximumRate && firstMaximumRate.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstMaximumRate.modifiedDate, targetTimeZone);
                    firstMaximumRate.modifiedDate = convertedModifiedOn;
                }

                if (firstExtraAdultRate && firstExtraAdultRate.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstExtraAdultRate.modifiedDate, targetTimeZone);
                    firstExtraAdultRate.modifiedDate = convertedModifiedOn;
                }

                if (firstExtraChildRate && firstExtraChildRate.modifiedDate) {
                    const convertedModifiedOn = convertTimestampToCustomFormat(firstExtraChildRate.modifiedDate, targetTimeZone);
                    firstExtraChildRate.modifiedDate = convertedModifiedOn;
                }

                return {
                    ...room._doc,
                    dateUTC: convertedDateUTC,
                    roomDescription:firstRoomDescription,
                    roomTypeName: firstRoomTypeName,
                    bedType: firstBedType,
                    baseAdult: firstBaseAdult,
                    baseChild: firstBaseChild,
                    maxAdult:firstMaxAdult,
                    maxChild: firstMaxChild,
                    maxOccupancy: firstMaxOccupancy,
                    baseRate: firstBaseRate,
                    minimumRate: firstMinimumRate,
                    maximumRate: firstMaximumRate,
                    extraAdultRate: firstExtraAdultRate,
                    extraChildRate: firstExtraChildRate,
                    amenities:firstAmenities
                };
            });

            return res.status(200).json({ Rooms: convertedProperties, statuscode: 200 });
        } else {
            return res.status(404).json({ error: "No property found", statuscode: 404 });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};

export default userProperty;
