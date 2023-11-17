import * as dotenv from "dotenv";
dotenv.config();
import roomModel from "../../models/roomType.js";
import bedType from "../../models/superAdmin/bedType.js"
import roomImage from "../../models/roomTypeImages.js"
import barRatePlan from "../../models/barRatePlan.js"
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";

const fetchRoom = async (req, res) => {
    try {
        const { targetTimeZone, userId, roomTypeId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
          
            const roomImages = await roomImage.find({ roomTypeId: roomTypeId });
            const barrate = await barRatePlan.find({ roomTypeId: roomTypeId });
           // console.log(roomImages)
            const rooms = await roomModel.find({ roomTypeId: roomTypeId });
            if (!rooms) {
                return res.status(400).json({ message: "Please enter roomTypeId", statuscode: 400 })
            }


            if (rooms.length > 0) {
                // Map and modify each room object to only include the first element of the arrays
                const convertedProperties = await Promise.all(rooms.map(async (room) => {
                    // Convert the dateUTC to the user's time zone
                    const convertedDateUTC = convertTimestampToCustomFormat(room.createdOn, targetTimeZone);

                    // Access the first element of each array
                    const firstRoomDescription = room.roomDescription[0].roomDescription;
                    const shortCode = room.shortCode[0].shortCode;
                    const firstRoomTypeName = room.roomTypeName[0].roomTypeName;
                    const firstNumberOfRooms = room.numberOfRooms[0].numberOfRooms;
                    const firstNumberOfBeds = room.noOfBeds[0].noOfBeds;
                    const firstBedType = room.bedType[0].bedType;
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
                    const amenitiesCount = room.amenities[0].amenities;
                    const roomTypeId = room.roomTypeId || ''

                    //bedTypes
                    const bedTypeIds = firstBedType.map((item)=>item.bedTypeId)
                   // console.log(bedTypeIds)
                    // Find bedTypeId from bedType model based on firstBedType
                    const foundBedTypes = await bedType.find({ bedTypeId: { $in: bedTypeIds } });
                 //   console.log(foundBedTypes)
                    const bedTypes = foundBedTypes.map((foundBed) => ({
                        bedTypeId: foundBed.bedTypeId,
                        bedType: foundBed.bedType,
                    }));
                    
                   
                const filteredRoomImages = roomImages.filter(img => img.roomTypeId === roomTypeId);
                
                // Extract necessary data from roomImages
                const imagesData = filteredRoomImages.map(img => ({
                    image: img.roomImages[0].image,
                    
                }));
       

                // Include fetched roomImages in the property object
               
                    return {
                        shortCode: shortCode,
                        roomDescription: firstRoomDescription,
                        roomTypeName: firstRoomTypeName,
                        numberOfRooms: firstNumberOfRooms,
                        noOfBeds: firstNumberOfBeds,
                        bedType: bedTypes,
                        baseAdult: firstBaseAdult,
                        baseChild: firstBaseChild,
                        maxAdult: firstMaxAdult,
                        maxChild: firstMaxChild,
                        maxOccupancy: firstMaxOccupancy,
                        baseRate: firstBaseRate,
                        minimumRate: firstMinimumRate,
                        maximumRate: firstMaximumRate,
                        extraAdultRate: firstExtraAdultRate,
                        extraChildRate: firstExtraChildRate,
                        amenities: amenitiesCount,
                        roomTypeId: roomTypeId,
                        roomImages: imagesData,
                        roomTypeId: roomTypeId
                    };

                    
                }));

                return res.status(200).json({ data: convertedProperties, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No room found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, statusCode: 500 });
    }
};

export default fetchRoom;


