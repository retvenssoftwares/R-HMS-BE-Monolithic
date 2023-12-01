import bookingModel from "../../models/confirmBooking.js";
import holdData from "../../models/holdBooking.js";
import roomTypeModel from "../../models/roomType.js";
import verifiedUser from "../../models/verifiedUsers.js";
import manageInventory from "../../models/manageInventory.js";
import reservationModel from "../../models/reservationType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const getInventory = async (req, res) => {
    const { userId, propertyId, checkInDate, checkOutDate } = req.query;
    const authCodeValue = req.headers["authcode"];

    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser || !userId) {
        return res
            .status(400)
            .json({ message: "User not found or invalid userId", statuscode: 400 });
    }

    const getReservationTypeName = await reservationModel.findOne({
        $or: [
            { "reservationName.0.reservationName": "Confirmed" },
            { "reservationName.0.reservationName": "confirmed" },
            { "reservationName.0.reservationName": "confirm" },
            { "reservationName.0.reservationName": "Confirm" }
        ]
    }).select('reservationName reservationTypeId');
    // console.log(getReservationTypeName.reservationTypeId)
    const reservationId = getReservationTypeName.reservationTypeId
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (!result.success) {
        return res
            .status(result.statuscode)
            .json({ message: result.message, statuscode: result.statuscode });
    }

    try {
        const startDateObj = new Date(checkInDate);
        const checkInDateISO = startDateObj.toISOString();
        const endDateObj = new Date(checkOutDate);
        const checkOutDateISO = endDateObj.toISOString();

        if (checkInDate > checkOutDate) {
            return res.status(400).json({ message: "Check-in date cannot be greater than check-out date", statuscode: 400 });
        }

        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateFormatRegex.test(checkInDate) || !dateFormatRegex.test(checkOutDate)) {
            return res.status(400).json({ message: "Please enter the date in the correct format (yyyy-mm-dd)", statuscode: 400 });
        }

        const roomTypes = await roomTypeModel.aggregate([
            { $match: { propertyId } },
            {
                $project: {
                    _id: 0,
                    roomTypeId: 1,
                    roomTypeName: { $arrayElemAt: ["$roomTypeName.roomTypeName", 0] },
                    numberOfRooms: { $arrayElemAt: ["$numberOfRooms.numberOfRooms", 0] },
                },
            },
        ]);

        if (!roomTypes || roomTypes.length === 0) {
            return res
                .status(400)
                .json({ message: "No room types found", statuscode: 400 });
        }

        const promises = roomTypes.map(async (roomType) => {
            const roomTypeId = roomType.roomTypeId;
            const roomTypeName = roomType.roomTypeName;

            const reservations = await bookingModel.find({
                propertyId,
                "roomTypeId.0.roomTypeId": roomTypeId,
                "barRateReservation.0.barRateReservation.0.bookingTypeId": reservationId,
                $or: [
                    {
                        $and: [
                            { "checkInDate.0.checkInDate": { $gte: checkInDateISO } },
                            { "checkInDate.0.checkInDate": { $lt: checkOutDateISO } }
                        ]
                    },
                    {
                        $and: [
                            { "checkInDate.0.checkInDate": { $lt: checkInDateISO } },
                            { "checkOutDate.0.checkOutDate": { $gt: checkInDateISO } }
                        ]
                    }
                ]
            });

            const holdBookings = await holdData.find({
                propertyId: propertyId,
                "roomTypeId.0.roomTypeId": roomTypeId,
                "barRateReservation.0.barRateReservation.0.bookingTypeId": reservationId,
                $or: [
                    {
                        $and: [
                            { "checkInDate.0.checkInDate": { $gte: checkInDateISO } },
                            { "checkInDate.0.checkInDate": { $lt: checkOutDateISO } }
                        ]
                    },
                    {
                        $and: [
                            { "checkInDate.0.checkInDate": { $lt: checkInDateISO } },
                            { "checkOutDate.0.checkOutDate": { $gt: checkInDateISO } }
                        ]
                    }
                ]
            });

            const reducedCount = reservations.length + holdBookings.length;

            const manageInventoryData = await manageInventory.aggregate([
                { $match: { propertyId: propertyId, roomTypeId: roomTypeId } },
            ]);

            const inventoryValues = holdBookings.map((booking) => booking.inventory);

            const addedInventoryDates = [
                ...new Set(
                    manageInventoryData.flatMap((item) =>
                        item.manageInventory.addedInventory
                            .filter(
                                (added) =>
                                    added.date >= checkInDate && added.date <= checkOutDate
                            )
                            .map((added) => added.date)
                    )
                ),
            ];

            const blockedInventoryDates = [
                ...new Set(
                    manageInventoryData.flatMap((item) =>
                        item.manageInventory.blockedInventory
                            .filter(
                                (blocked) =>
                                    blocked.date >= checkInDate && blocked.date <= checkOutDate
                            )
                            .map((blocked) => blocked.date)
                    )
                ),
            ];

            let holdBookingsCount = 0;
            if (inventoryValues.length > 0) {
                holdBookingsCount = inventoryValues.reduce((sum, value) => sum + value, 0);
            }

            const allDates = [
                ...new Set([...addedInventoryDates, ...blockedInventoryDates]),
            ];

            let currentDate = new Date(checkInDate);
            let calculatedInventoryData = [];

            while (currentDate <= endDateObj) {
                const dateISO = currentDate.toISOString().split("T")[0];

                const isDateBooked = reservations.some(
                    (booking) =>
                        new Date(booking.checkInDate[0].checkInDate) <= currentDate &&
                        new Date(booking.checkOutDate[0].checkOutDate) > currentDate
                );

                const isDateHoldBooked = holdBookings.some(
                    (holdBooking) =>
                        new Date(holdBooking.checkInDate[0].checkInDate) <= currentDate &&
                        new Date(holdBooking.checkOutDate[0].checkOutDate) > currentDate
                );

                const blockedInventoryTotal = manageInventoryData.reduce(
                    (total, item) => {
                        const blockedItem = item.manageInventory.blockedInventory.find(
                            (blocked) => blocked.date === dateISO
                        );

                        return total + (blockedItem ? blockedItem.blockedInventory : 0);
                    },
                    0
                );

                const addedInventoryTotal = manageInventoryData.reduce(
                    (total, item) => {
                        const addedItem = item.manageInventory.addedInventory.find(
                            (added) => added.date === dateISO
                        );

                        return total + (addedItem ? addedItem.addedInventory : 0);
                    },
                    0
                );

                const holdBookingsCount = holdBookings.filter(
                    (holdBooking) =>
                        new Date(holdBooking.checkInDate[0].checkInDate) <= currentDate &&
                        new Date(holdBooking.checkOutDate[0].checkOutDate) > currentDate
                ).length;

                const bookingsCount = reservations.filter(
                    (holdBooking) =>
                        new Date(holdBooking.checkInDate[0].checkInDate) <= currentDate &&
                        new Date(holdBooking.checkOutDate[0].checkOutDate) > currentDate
                ).length;

                // console.log(holdBookingsCount, bookingsCount)
                // console.log(blockedInventoryTotal, addedInventoryTotal)
                let inventory;

                if (!isDateBooked && !isDateHoldBooked) {
                    inventory = roomType.numberOfRooms + addedInventoryTotal - blockedInventoryTotal;
                } else {
                    // console.log("afvasf")
                    inventory = Math.abs(
                        roomType.numberOfRooms +
                        addedInventoryTotal -
                        blockedInventoryTotal -
                        holdBookingsCount -
                        bookingsCount
                    );
                }

                calculatedInventoryData.push({
                    date: dateISO,
                    inventory,
                    // /isBlocked: blockedInventoryTotal > 0 ? "true" : "false",
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }

            calculatedInventoryData.sort((a, b) => (a.date > b.date ? 1 : -1));

            return {
                roomTypeId,
                roomTypeName,
                numberOfRooms: roomType.numberOfRooms,
                calculatedInventoryData: calculatedInventoryData.length > 0
                    ? calculatedInventoryData.map((item) => {
                        let isBlocked = "false";
                        // console.log(item.date)
                        // console.log(item.inventory)
                        // console.log(roomType.numberOfRooms)
                        if (blockedInventoryDates.includes(item.date) && item.inventory < roomType.numberOfRooms) {
                            isBlocked = "true"
                        }


                        return {
                            ...item,
                            isBlocked,
                        };
                    })
                    : "false",
            };
        });

        const availableRooms = await Promise.all(promises);

        if (req.query.status) {
            return availableRooms;
        } else {
            return res
                .status(200)
                .json({ data: availableRooms, statuscode: 200 });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getInventory;