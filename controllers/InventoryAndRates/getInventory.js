import bookingModel from "../../models/confirmBooking.js"
import holdData from "../../models/holdBooking.js";
import roomTypeModel from "../../models/roomType.js";
import verifiedUser from "../../models/verifiedUsers.js";
import manageInventory from '../../models/manageInventory.js'
import restrictions from '../../models/manageRestrictions.js'
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const getInventory = async (req, res) => {
    // console.log(req,"req")
    const { userId, propertyId, checkInDate, checkOutDate } = req.query;

    // console.log(userId)
    const authCodeValue = req.headers['authcode'];

    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser || !userId) {
        return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 });
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (result.success) {
        if (checkInDate === checkOutDate) {
            console.log(checkInDate,checkOutDate)
            return res.status(400).json({ message: "Check-in date cannot be equal to check-out date", statuscode: 400 });
        } 
        if (checkInDate > checkOutDate) {
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
            // let holdBookingsCount = 0;
            // console.log("Before loop:");
            // console.log(new Date().getSeconds())
            for (const roomType of roomTypes) {

                const roomTypeId = roomType.roomTypeId;
                const roomTypeName = roomType.roomTypeName;
                // console.log(roomTypeId)
                // console.log("Inside loop:", holdBookingsCount);
                const reservations = await bookingModel.find({
                    propertyId,
                    checkInDate: { $gte: checkInDateISO, $lt: checkOutDateISO },
                    roomTypeId: roomTypeId
                });
                // console.log("1", reservations)

                const reducedCount = reservations.length
                // console.log(reducedCount, "reducedCount")

                // console.log(holdBookingsCount)

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

                const manageRestrictions = manageRestrictionsData[0] ? manageRestrictionsData[0].manageRestrictions : [];
                // Initialize these variables as empty arrays by default
                // let sortedStopSell = [];
                let sortedCOA = [];
                let sortedCOD = [];
                const COA = manageRestrictions.COA || [];
                const COD = manageRestrictions.COD || [];


                sortedCOA = COA.length === 0
                    ? []
                    : COA.sort((a, b) => (a.date > b.date) ? 1 : -1);

                sortedCOD = COD.length === 0
                    ? []
                    : COD.sort((a, b) => (a.date > b.date) ? 1 : -1);

                const holdBookings = await holdData.find({ propertyId: propertyId, roomTypeId: roomTypeId });
                const inventoryValues = holdBookings.map(booking => booking.inventory);

                // console.log("inv vals", inventoryValues)
                // Iterate through the date range, and add missing dates with numberOfRooms value
                let currentDate = new Date(checkInDate);

                if (reservations.length !== 0) {

                    let holdBookingsCount = 0;
                    if (inventoryValues.length > 0) {
                        holdBookingsCount = inventoryValues[0]
                        // console.log(holdBookingsCount, "holdBookingsCount")
                    }
                    // console.log(123)


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
                    let calculatedInventoryData = [];
                    const allDates = [...new Set([...addedInventoryDates, ...blockedInventoryDates])];



                    while (currentDate <= endDateObj) {
                        const dateISO = currentDate.toISOString().split("T")[0];
                        const blockedInventoryTotal = manageInventoryData.reduce((total, item) => {
                            const blockedItem = item.manageInventory.blockedInventory.find(blocked => blocked.date === dateISO);
                            return total + (blockedItem ? blockedItem.blockedInventory : 0);
                        }, 0);
                        // console.log(holdBookingsCount)
                        const roomTypeInventory = roomType.numberOfRooms - blockedInventoryTotal - reducedCount - holdBookingsCount;
                        // console.log(roomTypeInventory, "roominvent")

                        if (!allDates.includes(dateISO)) {
                            // console.log("helo")
                            calculatedInventoryData.push({
                                date: dateISO,
                                inventory: roomTypeInventory
                            });
                        } else {
                            const addedInventoryTotal = manageInventoryData.reduce((total, item) => {
                                const addedItem = item.manageInventory.addedInventory.find(added => added.date === dateISO);
                                return total + (addedItem ? addedItem.addedInventory : 0);
                            }, 0);

                            calculatedInventoryData.push({
                                date: dateISO,
                                inventory: Math.abs(roomType.numberOfRooms + addedInventoryTotal - blockedInventoryTotal - reducedCount - holdBookingsCount)
                            });
                        }

                        currentDate.setDate(currentDate.getDate() + 1); // Move to the next date
                    }
                    // Sort the calculated inventory data by date in ascending order
                    calculatedInventoryData.sort((a, b) => (a.date > b.date) ? 1 : -1);

                    const matchingDates = calculatedInventoryData.map((item) => item.date);


                    const matchedCOA = matchingDates.map((date) => {
                        const COAEntry = sortedCOA.find((entry) => entry.date === date);
                        return COAEntry ? COAEntry.COA : "false";
                    });

                    const matchedCOD = matchingDates.map((date) => {
                        const CODEntry = sortedCOD.find((entry) => entry.date === date);
                        return CODEntry ? CODEntry.COD : "false";
                    });


                    calculatedInventoryData = calculatedInventoryData.map((item) => ({
                        ...item,
                        // stopSell: matchedStopSell[matchingDates.indexOf(item.date)],
                        COA: matchedCOA[matchingDates.indexOf(item.date)],
                        COD: matchedCOD[matchingDates.indexOf(item.date)],
                        // minimumLOS: matchedMinimumLOS[matchingDates.indexOf(item.date)],
                        // maximumLOS: matchedMaximumLOS[matchingDates.indexOf(item.date)],
                    }));


                    if (calculatedInventoryData.length === 0) {
                        availableRooms.push({
                            roomTypeId,
                            roomTypeName,
                            numberOfRooms: roomType.numberOfRooms,
                            calculatedInventoryData: false, // Set to [] when empty
                        });
                    } else {
                        // Add isBlocked variable based on the blockedInventory data
                        const inventoryWithBlockedInfo = calculatedInventoryData.map((item) => ({
                            ...item,
                            isBlocked: blockedInventoryDates.includes(item.date).toString(),
                        }));
                        availableRooms.push({
                            roomTypeId,
                            roomTypeName,
                            numberOfRooms: roomType.numberOfRooms,
                            calculatedInventoryData: inventoryWithBlockedInfo
                        });
                    }
                } else {
                    // Filter and collect unique dates within the specified date range
                    // console.log(258)
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
                    let calculatedInventoryData = [];
                    const allDates = [...new Set([...addedInventoryDates, ...blockedInventoryDates])];

                    // Iterate through the date range, and add missing dates with numberOfRooms value
                    let currentDate = new Date(checkInDate);
                    let holdBookingsCount = 0;
                    if (inventoryValues.length > 0) {
                        holdBookingsCount = inventoryValues[0]
                        // console.log(holdBookingsCount, "holdBookingsCount")
                    }
                    // console.log(new Date().getSeconds())
                    while (currentDate <= endDateObj) {
                        const dateISO = currentDate.toISOString().split("T")[0];
                        const blockedInventoryTotal = manageInventoryData.reduce((total, item) => {
                            const blockedItem = item.manageInventory.blockedInventory.find(blocked => blocked.date === dateISO);
                            return total + (blockedItem ? blockedItem.blockedInventory : 0);
                        }, 0);
                        const roomTypeInventory = roomType.numberOfRooms - blockedInventoryTotal - holdBookingsCount;
                        // console.log(holdBookingsCount, "holdBookingsCount")
                        // console.log(roomTypeInventory, "rti")
                        if (!allDates.includes(dateISO)) {
                            calculatedInventoryData.push({
                                date: dateISO,
                                inventory: roomTypeInventory
                            });
                        } else {
                            const addedInventoryTotal = manageInventoryData.reduce((total, item) => {
                                const addedItem = item.manageInventory.addedInventory.find(added => added.date === dateISO);
                                return total + (addedItem ? addedItem.addedInventory : 0);
                            }, 0);

                            calculatedInventoryData.push({
                                date: dateISO,
                                inventory: Math.abs(roomType.numberOfRooms + addedInventoryTotal - blockedInventoryTotal - holdBookingsCount)
                            });
                        }

                        currentDate.setDate(currentDate.getDate() + 1); // Move to the next date
                    }
                    // console.log(new Date().getSeconds())
                    // console.log(calculatedInventoryData)
                    // Sort the calculated inventory data by date in ascending order
                    calculatedInventoryData.sort((a, b) => (a.date > b.date) ? 1 : -1);

                    const matchingDates = calculatedInventoryData.map((item) => item.date);

                    const matchedCOA = matchingDates.map((date) => {
                        const COAEntry = sortedCOA.find((entry) => entry.date === date);
                        return COAEntry ? COAEntry.COA : "false";
                    });

                    const matchedCOD = matchingDates.map((date) => {
                        const CODEntry = sortedCOD.find((entry) => entry.date === date);
                        return CODEntry ? CODEntry.COD : "false";
                    });

                    // Then, update the calculatedInventoryData array with the matched values:

                    calculatedInventoryData = calculatedInventoryData.map((item) => ({
                        ...item,
                        // stopSell: matchedStopSell[matchingDates.indexOf(item.date)],
                        COA: matchedCOA[matchingDates.indexOf(item.date)],
                        COD: matchedCOD[matchingDates.indexOf(item.date)],
                        // minimumLOS: matchedMinimumLOS[matchingDates.indexOf(item.date)],
                        // maximumLOS: matchedMaximumLOS[matchingDates.indexOf(item.date)],
                    }));
                    // console.log(modifiedRes)
                    if (calculatedInventoryData.length === 0) {
                        availableRooms.push({
                            roomTypeId,
                            roomTypeName,
                            numberOfRooms: roomType.numberOfRooms,
                            calculatedInventoryData: false, // Set to [] when empty
                        });
                    } else {
                        const inventoryWithBlockedInfo = calculatedInventoryData.map((item) => ({
                            ...item,
                            isBlocked: blockedInventoryDates.includes(item.date).toString(),
                        }));
                        availableRooms.push({
                            roomTypeId,
                            roomTypeName,
                            numberOfRooms: roomType.numberOfRooms,
                            calculatedInventoryData: inventoryWithBlockedInfo,
                        });
                    }
                }
            }
        


            if (req.query.status) {
                return availableRooms;
            } else {
                return res.status(200).json({ data: availableRooms, statuscode: 200 })
            }

            // return availableRooms;
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
        }
    } else {
        return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
};

export default getInventory