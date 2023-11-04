import bookingModel from "../../models/bookings.js"
import roomTypeModel from "../../models/roomType.js";
import verifiedUser from "../../models/verifiedUsers.js";
import manageInventory from '../../models/manageInventory.js'
import restrictions from '../../models/manageRestrictions.js'
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const getInventory = async (req, res) => {
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
                        roomTypeName: { $arrayElemAt: ["$roomTypeName.roomTypeName", 0] },
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
                const roomTypeName = roomType.roomTypeName;
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

                const manageRestrictionsData = await restrictions.aggregate([
                    {
                        $match: {
                            propertyId: propertyId,
                            roomTypeId: roomTypeId
                        }
                    },
                    {
                        $unwind: "$manageRestrictions" // Unwind to access each restriction entry
                    },
                    {
                        $match: {
                            $or: [
                                {
                                    "manageRestrictions.stopSell.date": { $gte: checkInDate, $lte: checkOutDate }
                                },
                                {
                                    "manageRestrictions.COA.date": { $gte: checkInDate, $lte: checkOutDate }
                                },
                                {
                                    "manageRestrictions.COD.date": { $gte: checkInDate, $lte: checkOutDate }
                                },
                                {
                                    "manageRestrictions.minimumLOS.date": { $gte: checkInDate, $lte: checkOutDate }
                                },
                                {
                                    "manageRestrictions.maximumLOS.date": { $gte: checkInDate, $lte: checkOutDate }
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "manageRestrictions.stopSell": 1,
                            "manageRestrictions.COA": 1,
                            "manageRestrictions.COD": 1,
                            "manageRestrictions.minimumLOS": 1,
                            "manageRestrictions.maximumLOS": 1
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
                    // Sort the calculated inventory data by date in ascending order
                    calculatedInventoryData.sort((a, b) => (a.date > b.date) ? 1 : -1);

                    const manageRestrictions = manageRestrictionsData[0] ? manageRestrictionsData[0].manageRestrictions : "false";
                    const stopSell = manageRestrictions.stopSell || "false";
                    const COA = manageRestrictions.COA || "false";
                    const COD = manageRestrictions.COD || "false";
                    const minimumLOS = manageRestrictions.minimumLOS || "false";
                    const maximumLOS = manageRestrictions.maximumLOS || "false";

                    if (calculatedInventoryData.length === 0) {
                        availableRooms.push({
                            roomTypeId,
                            roomTypeName,
                            numberOfRooms: roomType.numberOfRooms - reducedCount,
                            calculatedInventoryData: "false", // Set to "false" when empty
                            stopSell,
                            COA,
                            COD,
                            minimumLOS,
                            maximumLOS
                        });
                    } else {
                        availableRooms.push({
                            roomTypeId,
                            roomTypeName,
                            numberOfRooms: roomType.numberOfRooms - reducedCount,
                            calculatedInventoryData,
                            stopSell,
                            COA,
                            COD,
                            minimumLOS,
                            maximumLOS
                        });
                    }
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
                    // Sort the calculated inventory data by date in ascending order
                    calculatedInventoryData.sort((a, b) => (a.date > b.date) ? 1 : -1);
                    const manageRestrictions = manageRestrictionsData[0] ? manageRestrictionsData[0].manageRestrictions : "false";
                    const stopSell = manageRestrictions.stopSell || "false";
                    const COA = manageRestrictions.COA || "false";
                    const COD = manageRestrictions.COD || "false";
                    const minimumLOS = manageRestrictions.minimumLOS || "false";
                    const maximumLOS = manageRestrictions.maximumLOS || "false";

                    // console.log(modifiedRes)
                    if (calculatedInventoryData.length === 0) {
                        availableRooms.push({
                            roomTypeId,
                            roomTypeName,
                            numberOfRooms: roomType.numberOfRooms - reducedCount,
                            calculatedInventoryData: "false", // Set to "false" when empty
                            stopSell,
                            COA,
                            COD,
                            minimumLOS,
                            maximumLOS
                        });
                    } else {
                        availableRooms.push({
                            roomTypeId,
                            roomTypeName,
                            numberOfRooms: roomType.numberOfRooms - reducedCount,
                            calculatedInventoryData,
                            stopSell,
                            COA,
                            COD,
                            minimumLOS,
                            maximumLOS
                        });
                    }
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

export default getInventory;