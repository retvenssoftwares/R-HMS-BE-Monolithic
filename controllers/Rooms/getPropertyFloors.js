import floorData from "../../models/floor.js";
import roomTypeModel from "../../models/roomType.js";
import roomFloorDetails from "../../models/roomInFloor.js";
import { findUserByUserIdAndToken, validateHotelCode } from "../../helpers/helper.js";

const getFloors = async (req, res) => {
    try {
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            if (!propertyId) {
                return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 })
            }

            const result = await validateHotelCode(userId, propertyId)
            if (!result.success) {
                return res.status(result.statuscode).json({ message: "Invalid propertyId entered", statuscode: result.statuscode })
            }
            const getAllFloors = await floorData.find({ propertyId: propertyId }, '-_id').sort({_id:-1});
            if (getAllFloors) {
                const floorIds = [];
                const mappedFloors = getAllFloors.map(async (floor) => {
                    const floorInHotel = floor.floorInHotel || [];
                    const floorData = await Promise.all(floorInHotel.map(async (item) => {
                        // Collect floorIds in the array
                        floorIds.push(item.floorId || "");
                        // Find roomsMatchingFloors for each floor
                        const roomsMatchingFloors = await roomFloorDetails.find({ floorId: item.floorId });
                        // Extract all roomTypeIds from the room array of the found records
                        const roomTypeIds = roomsMatchingFloors.flatMap(room => room.room.map(item => item.roomTypeId));
                        // Find room types based on roomTypeIds
                        const findRoomTypes = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } })

                        // Include roomTypeId and roomTypeName in the response
                        return {
                            floorId: item.floorId || "",
                            floorName: item.floorName?.[0]?.floorName || "",
                            roomsInFloor: item.roomsInFloor?.[0]?.roomsInFloor || "",
                            roomTypeDetails: findRoomTypes.length > 0 ? findRoomTypes.map(roomType => ({
                                roomTypeId: roomType.roomTypeId || "",
                                roomTypeName: roomType.roomTypeName?.[0]?.roomTypeName || "",
                                baseRate: roomType.baseRate?.[0]?.baseRate || "",
                            })) : "",
                        };
                    }));
                    return floorData;
                });
                // console.log(floorIds);

                // Flatten the nested arrays
                const flattenedFloors = await Promise.all(mappedFloors);
                const flattenedFloorsArray = flattenedFloors.flat();

                return res.status(200).json({ data: flattenedFloorsArray, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No floors found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default getFloors;
