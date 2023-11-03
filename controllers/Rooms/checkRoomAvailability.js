import bookingModel from "../../models/bookings.js"
import roomTypeModel from "../../models/roomType.js";
import verifiedUser from "../../models/verifiedUsers.js";
import manageInventory from '../../models/manageInventory.js'
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
        if (checkInDate === checkOutDate) {
            return res.status(400).json({ message: "Check-in date cannot be equal to check-out date", statuscode: 400 });
        } else if (checkInDate > checkOutDate) {
            return res.status(400).json({ message: "Check-in date cannot be greater than check-out date", statuscode: 400 });
        }

        // Validate the date format
        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateFormatRegex.test(checkInDate) || !dateFormatRegex.test(checkOutDate)) {
            return res.status(400).json({ message: "Please enter the date in the correct format (yyyy-mm-dd)", statuscode: 400 });
        }
        try {
            const startDateObj = new Date(checkInDate)
            const checkInDateISO = startDateObj.toISOString()
            const endDateObj = new Date(checkOutDate)
            const checkOutDateISO = endDateObj.toISOString();

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
                // console.log(roomTypeId)

                const reservations = await bookingModel.find({
                    propertyId,
                    "checkIn.checkIn": { $gte: checkInDateISO, $lt: checkOutDateISO },
                    "roomDetails.roomTypeId.roomTypeId": roomTypeId
                });

                // Calculate the reduced count by counting occurrences of the roomTypeId in reservations
                const reducedCount = reservations.reduce((total, reservation) => {
                    const roomTypeOccurrences = reservation.roomDetails.filter(detail => detail.roomTypeId[0].roomTypeId === roomTypeId).length;
                    return total + roomTypeOccurrences;
                }, 0);

                const manageInventoryData = await manageInventory.aggregate([
                    {
                        $match: {
                            propertyId: propertyId,
                            roomTypeId: roomTypeId
                        }
                    }
                ]);

                if (reservations.length !== 0) {
                    // const reducedCount = reservations.filter(reservation => reservation.roomDetails.some(detail => detail.roomTypeId[0].roomTypeId === roomTypeId)).length;
                    // const roomTypeCount = roomType.numberOfRooms - reducedCount;

                    const addedInventoryDates = [...new Set(
                        manageInventoryData.flatMap(item => item.manageInventory.addedInventory
                            .filter(added => added.date >= checkInDate && added.date <= checkOutDate)
                            .map(added => added.date)
                        ))
                    ];

                    const blockedInventoryDates = [...new Set(
                        manageInventoryData.flatMap(item => item.manageInventory.blockedInventory
                            .filter(blocked => blocked.date >= checkInDate && blocked.date <= checkOutDate)
                            .map(blocked => blocked.date)
                        ))
                    ];
                    // Calculate the final inventory values for each date in the interval
                    const calculatedInventoryData = [];
                    const allDates = [...new Set([...addedInventoryDates, ...blockedInventoryDates])];

                    for (const date of allDates) {
                        const addedInventoryTotal = manageInventoryData.reduce((total, item) => {
                            const addedItem = item.manageInventory.addedInventory.find(added => added.date === date);
                            return total + (addedItem ? addedItem.addedInventory : 0);
                        }, 0);

                        const blockedInventoryTotal = manageInventoryData.reduce((total, item) => {
                            const blockedItem = item.manageInventory.blockedInventory.find(blocked => blocked.date === date);
                            return total + (blockedItem ? blockedItem.blockedInventory : 0);
                        }, 0);

                        calculatedInventoryData.push({
                            date,
                            inventory: Math.abs(roomType.numberOfRooms + addedInventoryTotal - blockedInventoryTotal - reducedCount)
                        });
                        // console.log(calculatedInventoryData)
                    }

                    availableRooms.push({ roomTypeId, numberOfRooms: roomType.numberOfRooms - reducedCount, calculatedInventoryData });
                } else {
                    // Filter and collect unique dates within the specified date range
                    const addedInventoryDates = [...new Set(
                        manageInventoryData.flatMap(item => item.manageInventory.addedInventory
                            .filter(added => added.date >= checkInDate && added.date <= checkOutDate)
                            .map(added => added.date)
                        ))
                    ];

                    const blockedInventoryDates = [...new Set(
                        manageInventoryData.flatMap(item => item.manageInventory.blockedInventory
                            .filter(blocked => blocked.date >= checkInDate && blocked.date <= checkOutDate)
                            .map(blocked => blocked.date)
                        ))
                    ];

                    // Calculate the final inventory values for each date in the interval
                    const calculatedInventoryData = [];
                    const allDates = [...new Set([...addedInventoryDates, ...blockedInventoryDates])];

                    for (const date of allDates) {
                        const addedInventoryTotal = manageInventoryData.reduce((total, item) => {
                            const addedItem = item.manageInventory.addedInventory.find(added => added.date === date);
                            return total + (addedItem ? addedItem.addedInventory : 0);
                        }, 0);

                        const blockedInventoryTotal = manageInventoryData.reduce((total, item) => {
                            const blockedItem = item.manageInventory.blockedInventory.find(blocked => blocked.date === date);
                            return total + (blockedItem ? blockedItem.blockedInventory : 0);
                        }, 0);

                        calculatedInventoryData.push({
                            date,
                            inventory: Math.abs(roomType.numberOfRooms + addedInventoryTotal - blockedInventoryTotal - reducedCount)
                        });

                    }
                    // console.log(calculatedInventoryData)
                    availableRooms.push({ roomTypeId, numberOfRooms: roomType.numberOfRooms - reducedCount, calculatedInventoryData: calculatedInventoryData });
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