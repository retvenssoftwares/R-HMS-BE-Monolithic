import bookingModel from "../../models/confirmBooking.js";
import holdData from "../../models/holdBooking.js";
import roomTypeModel from "../../models/roomType.js";
import verifiedUser from "../../models/verifiedUsers.js";
import manageInventory from '../../models/manageInventory.js';
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const getRoomAvailability = async (req, res) => {
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
        }

        if (checkInDate > checkOutDate) {
            return res.status(400).json({ message: "Check-in date cannot be greater than check-out date", statuscode: 400 });
        }

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
                { $match: { propertyId } },
                {
                    $project: {
                        _id: 0,
                        roomTypeId: 1,
                        roomTypeName: { $arrayElemAt: ["$roomTypeName.roomTypeName", 0] },
                        baseAdult: { $arrayElemAt: ["$baseAdult.baseAdult", 0] },
                        maxAdult: { $arrayElemAt: ["$maxAdult.maxAdult", 0] },
                        maxChild: { $arrayElemAt: ["$maxChild.maxChild", 0] },
                        baseChild: { $arrayElemAt: ["$baseChild.baseChild", 0] },
                        numberOfRooms: { $arrayElemAt: ["$numberOfRooms.numberOfRooms", 0] }
                    }
                }
            ]);

            if (!roomTypes || roomTypes.length === 0) {
                return res.status(400).json({ message: "No room types found", statuscode: 400 });
            }

            const availableRooms = await Promise.all(roomTypes.map(async (roomType) => {
                const { roomTypeId, roomTypeName, baseAdult, baseChild, maxChild, maxAdult, numberOfRooms } = roomType;

                const reservations = await bookingModel.find({
                    propertyId,
                    checkInDate: { $gte: checkInDateISO, $lt: checkOutDateISO },
                    roomTypeId: roomTypeId
                });

                const reducedCount = reservations.length;
                const manageInventoryData = await manageInventory.aggregate([
                    { $match: { propertyId: propertyId, roomTypeId: roomTypeId } }
                ]);

                const holdBookings = await holdData.find({ propertyId: propertyId, roomTypeId: roomTypeId });
                const inventoryValues = holdBookings.map(booking => booking.inventory);

                let currentDate = new Date(checkInDate);

                if (reservations.length !== 0) {
                    let holdBookingsCount = 0;

                    if (inventoryValues.length > 0) {
                        holdBookingsCount = inventoryValues.reduce((sum, value) => sum + value, 0);
                    }

                    const addedInventoryDates = new Set(
                        manageInventoryData.flatMap(item => item.manageInventory.addedInventory
                            .filter(added => added.date >= checkInDate && added.date <= checkOutDate)
                            .map(added => added.date)
                        )
                    );

                    const blockedInventoryDates = new Set(
                        manageInventoryData.flatMap(item => item.manageInventory.blockedInventory
                            .filter(blocked => blocked.date >= checkInDate && blocked.date <= checkOutDate)
                            .map(blocked => blocked.date)
                        )
                    );

                    let calculatedInventoryData = [];

                    while (currentDate <= endDateObj) {
                        const dateISO = currentDate.toISOString().split("T")[0];
                        const blockedInventoryTotal = manageInventoryData.reduce((total, item) => {
                            const blockedItem = item.manageInventory.blockedInventory.find(blocked => blocked.date === dateISO);
                            return total + (blockedItem ? blockedItem.blockedInventory : 0);
                        }, 0);

                        const roomTypeInventory = numberOfRooms - blockedInventoryTotal - reducedCount - holdBookingsCount;

                        if (!addedInventoryDates.has(dateISO)) {
                            calculatedInventoryData.push({ date: dateISO, inventory: roomTypeInventory });
                        } else {
                            const addedInventoryTotal = manageInventoryData.reduce((total, item) => {
                                const addedItem = item.manageInventory.addedInventory.find(added => added.date === dateISO);
                                return total + (addedItem ? addedItem.addedInventory : 0);
                            }, 0);

                            calculatedInventoryData.push({
                                date: dateISO,
                                inventory: Math.abs(numberOfRooms + addedInventoryTotal - blockedInventoryTotal - reducedCount - holdBookingsCount)
                            });
                        }

                        currentDate.setDate(currentDate.getDate() + 1);
                    }

                    calculatedInventoryData.sort((a, b) => (a.date > b.date) ? 1 : -1);

                    if (calculatedInventoryData.length === 0) {
                        return {
                            roomTypeId,
                            roomTypeName,
                            baseAdult,
                            baseChild,
                            maxChild,
                            maxAdult,
                            minimumInventory: false,
                        };
                    } else {
                        const minInventory = Math.min(...calculatedInventoryData.map(data => data.inventory));
                        return {
                            roomTypeId,
                            roomTypeName,
                            baseAdult,
                            baseChild,
                            maxChild,
                            maxAdult,
                            minimumInventory: minInventory,
                        };
                    }
                } else {
                    const addedInventoryDates = new Set(
                        manageInventoryData.flatMap(item => item.manageInventory.addedInventory
                            .filter(added => added.date >= checkInDate && added.date <= checkOutDate)
                            .map(added => added.date)
                        )
                    );

                    const blockedInventoryDates = new Set(
                        manageInventoryData.flatMap(item => item.manageInventory.blockedInventory
                            .filter(blocked => blocked.date >= checkInDate && blocked.date <= checkOutDate)
                            .map(blocked => blocked.date)
                        )
                    );

                    let calculatedInventoryData = [];

                    let currentDate = new Date(checkInDate);
                    let holdBookingsCount = 0;

                    if (inventoryValues.length > 0) {
                        holdBookingsCount = inventoryValues.reduce((sum, value) => sum + value, 0);
                    }

                    while (currentDate <= endDateObj) {
                        const dateISO = currentDate.toISOString().split("T")[0];
                        const blockedInventoryTotal = manageInventoryData.reduce((total, item) => {
                            const blockedItem = item.manageInventory.blockedInventory.find(blocked => blocked.date === dateISO);
                            return total + (blockedItem ? blockedItem.blockedInventory : 0);
                        }, 0);

                        const roomTypeInventory = numberOfRooms - blockedInventoryTotal - holdBookingsCount;

                        if (!addedInventoryDates.has(dateISO)) {
                            calculatedInventoryData.push({ date: dateISO, inventory: roomTypeInventory });
                        } else {
                            const addedInventoryTotal = manageInventoryData.reduce((total, item) => {
                                const addedItem = item.manageInventory.addedInventory.find(added => added.date === dateISO);
                                return total + (addedItem ? addedItem.addedInventory : 0);
                            }, 0);

                            calculatedInventoryData.push({
                                date: dateISO,
                                inventory: Math.abs(numberOfRooms + addedInventoryTotal - blockedInventoryTotal - holdBookingsCount)
                            });
                        }

                        currentDate.setDate(currentDate.getDate() + 1);
                    }

                    calculatedInventoryData.sort((a, b) => (a.date > b.date) ? 1 : -1);

                    if (calculatedInventoryData.length === 0) {
                        return {
                            roomTypeId,
                            roomTypeName,
                            baseAdult,
                            maxChild,
                            maxAdult,
                            baseChild,
                            minimumInventory: false,
                        };
                    } else {
                        const minInventory = Math.min(...calculatedInventoryData.map(data => data.inventory));
                        return {
                            roomTypeId,
                            roomTypeName,
                            baseAdult,
                            maxChild,
                            maxAdult,
                            baseChild,
                            minimumInventory: minInventory,
                        };
                    }
                }
            }));

            if (req.query.status) {
                return availableRooms;
            } else {
                return res.status(200).json({ data: availableRooms, statuscode: 200 });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
        }
    } else {
        return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
};

export default getRoomAvailability;
