import bookingModel from "../../models/confirmBooking.js";
import holdData from "../../models/holdBooking.js";
import roomTypeModel from "../../models/roomType.js";
import verifiedUser from "../../models/verifiedUsers.js";
import manageInventory from "../../models/manageInventory.js";
import reservationModel from "../../models/reservationType.js"
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

        // if (checkInDate === checkOutDate) {
        //     // console.log(checkInDate, checkOutDate)
        //     return res.status(400).json({ message: "Check-in date cannot be equal to check-out date", statuscode: 400 });
        // }
        if (checkInDate > checkOutDate) {
            return res.status(400).json({ message: "Check-in date cannot be greater than check-out date", statuscode: 400 });
        }

        // Validate the date format
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
                "checkInDate.0.checkInDate": { $gte: checkInDateISO, $lt: checkOutDateISO },
                "roomTypeId.0.roomTypeId": roomTypeId,
            });


            const confirmBookingTypeIds = reservations.flatMap(booking =>
                booking.barRateReservation[0]?.barRateReservation.map(
                    reservation => reservation.bookingTypeId
                )
            );

            // Convert reservation name to lowercase if it's 'confirmed'
            const matchingReservations = await reservationModel.find({
                reservationTypeId: { $in: confirmBookingTypeIds },
            });
            const reservationNames = matchingReservations.map(booking => booking.reservationName[0]?.reservationName.toLowerCase());

            const isConfirmedReservation = reservationNames.includes('confirmed');
            console.log("Matching Reservation Names:", reservationNames);
            // If reservation name is 'confirmed', set reducedCount to the actual count
            const reducedCount = isConfirmedReservation ? reservations.length : 0;

            console.log(reducedCount, "14")

            const manageInventoryData = await manageInventory.aggregate([
                { $match: { propertyId: propertyId, roomTypeId: roomTypeId } },
            ]);

            const holdBookings = await holdData.find({
                propertyId: propertyId,
                "roomTypeId.0.roomTypeId": roomTypeId,
                "checkInDate.0.checkInDate": { $gte: checkInDateISO, $lt: checkOutDateISO },
            });

            const holdBookingTypeIds = holdBookings.flatMap(booking =>
                booking.barRateReservation[0]?.barRateReservation.map(
                    reservation => reservation.bookingTypeId
                )
            );

            // Convert reservation name to lowercase if it's 'confirmed'
            const matchingReservationsHolds = await reservationModel.find({
                reservationTypeId: { $in: holdBookingTypeIds },
            });
            const reservationNamesHolds = matchingReservationsHolds.map(booking => booking.reservationName[0]?.reservationName.toLowerCase());

            const isConfirmedReservationHold = reservationNamesHolds.includes('confirmed');
            let holdBookingsCount = 0;
            if (inventoryValues.length > 0) {
                // console.log(inventoryValues.length, "length");
                holdBookingsCount = inventoryValues.reduce((sum, value) => sum + value, 0);
                // console.log(holdBookingsCount);
            }

            // If reservation is 'confirmed', set holdBookingsCount to 0; otherwise, use the actual count
            holdBookingsCount = isConfirmedReservationHold ? 0 : holdBookingsCount;
            // // Combine and return the unique bookingTypeIds
            // const allBookingTypeIds = [...new Set([...holdBookingTypeIds, ...confirmBookingTypeIds])];

            // console.log("Booking Type Ids:", allBookingTypeIds);
            // Fetch reservation records with matching reservationTypeId


            // Extract reservationNames from the 0th object of the reservationName array
            // const reservationNames = matchingReservations.map(reservation => reservation.reservationName[0]?.reservationName);


            const inventoryValues = holdBookings.map((booking) => booking.inventory);
            // console.log(inventoryValues)

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



            const allDates = [
                ...new Set([...addedInventoryDates, ...blockedInventoryDates]),
            ];

            let currentDate = new Date(checkInDate);
            let calculatedInventoryData = [];

            while (currentDate <= endDateObj) {
                const dateISO = currentDate.toISOString().split("T")[0];
                const blockedInventoryTotal = manageInventoryData.reduce(
                    (total, item) => {
                        const blockedItem = item.manageInventory.blockedInventory.find(
                            (blocked) => blocked.date === dateISO
                        );
                        return total + (blockedItem ? blockedItem.blockedInventory : 0);
                    },
                    0
                );

                const roomTypeInventory =
                    roomType.numberOfRooms -
                    blockedInventoryTotal -
                    reducedCount -
                    holdBookingsCount;

                if (!allDates.includes(dateISO)) {
                    calculatedInventoryData.push({
                        date: dateISO,
                        inventory: roomTypeInventory,
                    });
                } else {
                    const addedInventoryTotal = manageInventoryData.reduce(
                        (total, item) => {
                            const addedItem = item.manageInventory.addedInventory.find(
                                (added) => added.date === dateISO
                            );
                            return total + (addedItem ? addedItem.addedInventory : 0);
                        },
                        0
                    );

                    calculatedInventoryData.push({
                        date: dateISO,
                        inventory: Math.abs(
                            roomType.numberOfRooms +
                            addedInventoryTotal -
                            blockedInventoryTotal -
                            reducedCount -
                            holdBookingsCount
                        ),
                    });
                }

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