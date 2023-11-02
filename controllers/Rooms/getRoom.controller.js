import * as dotenv from "dotenv";
dotenv.config();
import roomModel from "../../models/roomType.js";
import { convertTimestampToCustomFormat,findUserByUserIdAndToken } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
    try {
        const { targetTimeZone,userId,propertyId } = req.query;
        const authCodeValue = req.headers['authcode']
 
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

   if(result.success){
        const rooms = await roomModel.find({ propertyId: propertyId });

        if (rooms.length > 0) {
            // Map and modify each room object to only include the first element of the arrays
            const convertedProperties = rooms.map(room => {
                // Convert the dateUTC to the user's time zone
                const convertedDateUTC = convertTimestampToCustomFormat(room.dateUTC, targetTimeZone);

                // Access the first element of each array
                const firstRoomDescription = room.roomDescription[0].roomDescription;
                const shortCode = room.shortCode[0].shortCode;
                const firstRoomTypeName = room.roomTypeName[0].roomTypeName;
                const firstNumberOfRooms = room.numberOfRooms[0].numberOfRooms;
               const firstNumberOfBeds = room.noOfBeds[0].noOfBeds;
                const firstBedType = room.bedType[0].bedType.length;
                const firstBaseAdult = room.baseAdult[0].baseAdult;
                const firstBaseChild = room.baseChild[0].baseChild;
                const firstMaxAdult = room.maxAdult[0].maxAdult;
                const firstMaxChild = room.maxChild[0].maxChild;
                const firstMaxOccupancy = room.maxOccupancy[0].maxOccupancy;
                const firstBaseRate = room.baseRate[0].baseRate;
                const firstMinimumRate = room.minimumRate[0].minimumRate;
                const firstMaximumRate = room.maximumRate[0].maximumRate;
                const firstExtraAdultRate = room.extraAdultRate[0].extraAdultRate;
                const firstExtraChildRate = room.extraChildRate[0].extraChildRate;
                const amenitiesCount = room.amenities[0].amenities.length;
                const roomTypeId = room.roomTypeId || ''
                // Include the converted date and first elements in the property object

                return {
                    ...room._doc,
                    dateUTC: convertedDateUTC,
                    shortCode:shortCode,
                   roomDescription:firstRoomDescription,
                    roomTypeName: firstRoomTypeName,
                    numberOfRooms:firstNumberOfRooms,
                     noOfBeds:firstNumberOfBeds,
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
                    amenities:amenitiesCount,
                    roomTypeId: roomTypeId
                };
            });

            return res.status(200).json({ data: convertedProperties, statuscode: 200 });
        } else {
            return res.status(404).json({ message: "No property found", statuscode: 404 });
        }
    } else {
        return res.status(result.statuscode).json({ message: result.message });

    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, statusCode: 500 });
    }
};

export default userProperty;


