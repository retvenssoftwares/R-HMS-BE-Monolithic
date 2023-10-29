

// export default checkInventoryAvailability;
import bookingModel from "../../models/reservation.js"
import roomTypeModel from "../../models/roomType.js";
import verifiedUser from "../../models/verifiedUsers.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const checkInventoryAvailability = async (req, res) => {
    const { userId, propertyId, checkInDate, checkOutDate } = req.query;
    const authCodeValue = req.headers['authcode'];

    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser || !userId) {
        return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 });
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (result.success) {
        try {
            const roomTypes = await roomTypeModel.aggregate([
                {
                    $match: { propertyId }
                },
                {
                    $project: {
                        _id: 0,
                        roomTypeId: 1,
                        numberOfRooms: { $arrayElemAt: ["$numberOfRooms.numberOfRooms", 0] }
                    }
                }
            ]);

            if (!roomTypes || roomTypes.length === 0) {
                return res.status(400).json({ message: "No room types found", statuscode: 400 });
            }

            const availableRooms = [];

            for (const roomType of roomTypes) {
                const roomTypeId = roomType.roomTypeId;

                const reservations = await bookingModel.find({
                    propertyId,
                    "checkIn.checkIn": { $lt: checkOutDate },
                    "checkOut.checkOut": { $gte: checkInDate },
                    "roomDetails.roomTypeId.roomTypeId": roomTypeId
                });

                // console.log(reservations)

                if (reservations.length !== 0) {
                    // Count the occurrences of roomTypeId in roomDetails
                    const reducedCount = reservations.filter(reservation => reservation.roomDetails.some(detail => detail.roomTypeId[0].roomTypeId === roomTypeId)).length
                    const roomTypeCount = roomType.numberOfRooms - reducedCount;
                    // console.log(reducedCount, roomTypeCount)
                    availableRooms.push({ roomTypeId, numberOfRooms: roomType.numberOfRooms, inventory: roomTypeCount });
                } else {
                    // No reservations, full inventory available
                    availableRooms.push({ roomTypeId, numberOfRooms: roomType.numberOfRooms, inventory: roomType.numberOfRooms });
                }
            }

            return res.status(200).json({ data: availableRooms, statuscode: 200 });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
        }
    } else {
        return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
};

export default checkInventoryAvailability;
