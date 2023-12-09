import roomTypeModel from '../../models/roomType.js'
import roomInFloorModel from '../../models/roomInFloor.js'
import { findUserByUserIdAndToken, validateHotelCode } from '../../helpers/helper.js'

const stayViewDetails = async (req, res) => {
    try {
        const { userId, propertyId } = req.query;
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        const result2 = await validateHotelCode(userId, propertyId);

        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        if (!result2.success) {
            return res.status(result2.statuscode).json({ message: result2.message, statuscode: result2.statuscode });
        }

        // Get roomTypeIds and roomTypeNames for the given propertyId
        const getRoomNames = await roomTypeModel.aggregate([
            {
                $match: {
                    propertyId: propertyId
                }
            },
            {
                $project: {
                    _id: 0,
                    roomTypeName: { $arrayElemAt: ["$roomTypeName.roomTypeName", 0] },
                    roomTypeId: 1
                }
            }
        ]);

        if (getRoomNames.length === 0) {
            return res.status(200).json({ message: 'No rooms found in your property', statuscode: 200 });
        }

        // Get roomNos for the matching roomTypeIds in the roomInFloorModel
        const responseData = await Promise.all(getRoomNames.map(async (roomType) => {
            console.log(roomType.roomTypeId);
            const matchingRooms = await roomInFloorModel.find({
                propertyId: propertyId,
                "floorData.room.roomTypeId": roomType.roomTypeId
            }, { "floorData.room.roomTypeId.$": 1, "floorData.room.roomNumber": 1, _id: 0 });

            console.log('matchingRooms: ', matchingRooms);

            if (matchingRooms.length > 0 && matchingRooms[0].floorData && matchingRooms[0].floorData[0].room) {
                const commonRoomData = {
                    roomTypeId: roomType.roomTypeId,
                    roomTypeName: roomType.roomTypeName,
                };

                const roomNos = matchingRooms[0].floorData.reduce((acc, floor) => {
                    const roomEntries = floor.room.filter((room) => room.roomTypeId === roomType.roomTypeId);
                    const roomNumbers = roomEntries.map((entry) => entry.roomNumber);
                    return acc.concat(roomNumbers);
                }, []);

                console.log("roomTypeId and roomTypeName:", commonRoomData);
                console.log("roomNos:", roomNos);

                return { ...commonRoomData, roomNos: roomNos };
            } else {
                return { roomTypeName: roomType.roomTypeName, roomNos: [] };
            }
        }));
        return res.status(200).json({ data: responseData, statuscode: 200 });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default stayViewDetails;
