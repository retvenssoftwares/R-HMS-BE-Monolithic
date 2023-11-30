import roomTypeModel from '../../../models/roomType.js'
import confirmBookingDetails from '../../../models/confirmBooking.js';
import { findUserByUserIdAndToken } from '../../../helpers/helper.js';
const getBestSellersData = async (req, res) => {
    try {
        const { userId, propertyId, otaId, filter } = req.query;
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        const currentDate = new Date();
        if (filter === "Yearly") {

            // const startOfYear = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0);
            const startOfYear = new Date(currentDate);
            startOfYear.setDate(currentDate.getDate() - 365);

            const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

            const bookingData = await confirmBookingDetails.aggregate([
                {
                    $match: {
                        propertyId: propertyId,
                        otaId: otaId,
                        $expr: {
                            $and: [
                                { $gte: [{ $toDate: "$bookingTime" }, startOfYear] },
                                { $lt: [{ $toDate: "$bookingTime" }, endOfDay] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        roomTypeId: { $arrayElemAt: ["$roomTypeId.roomTypeId", 0] }, // Extract the roomTypeId from the 0th position,
                        bookingTime: 1,
                        reservationRate: 1,
                        nightCount: 1,

                    }
                }
            ]).exec();
            console.log(bookingData, "gftf")
            // Extract roomTypeIds from the bookingData
            const roomTypeIds = bookingData.map(entry => entry.roomTypeId);
            console.log('roomTypeIds: ', roomTypeIds);

            // Fetch roomType details based on the extracted roomTypeIds
            const roomTypeDetails = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } });
            console.log('roomTypeDetails: ', roomTypeDetails);
            const roomTypeIdCounts = roomTypeIds.reduce((counts, roomTypeId) => {
                counts[roomTypeId] = (counts[roomTypeId] || 0) + 1;
                return counts;
            }, {});
            const roomTypeRevenueMap = {}; // Map to store total revenue for each roomTypeId

            bookingData.forEach(entry => {
                const roomTypeId = entry.roomTypeId;
                const reservationRate = entry.reservationRate?.[0]?.roomCharges?.[0]?.grandTotal || 0;
                const nightCount = entry.nightCount?.[0]?.nightCount || 1;
                console.log('nightCount: ', nightCount);
                const totalRevenue = parseFloat(reservationRate) * parseInt(nightCount);
                roomTypeRevenueMap[roomTypeId] = (roomTypeRevenueMap[roomTypeId] || 0) + totalRevenue;
            });

            // Prepare the response object
            const responseData = roomTypeDetails.map(roomType => ({
                roomTypeId: roomType.roomTypeId,
                roomTypeName: roomType.roomTypeName[0].roomTypeName || '',
                count: roomTypeIdCounts[roomType.roomTypeId] || 0,
                totalRevenue: roomTypeRevenueMap[roomType.roomTypeId] || 0,
                // month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)
            }));

            return res.status(200).json({ data: responseData, statuscode: 200 });
        }

        if (filter === 'Monthly') {
            // const startDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
            const startDateTime = new Date(currentDate);
            startDateTime.setDate(currentDate.getDate() - 30);
            console.log(startDateTime)
            const endDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
            console.log(startDateTime, endDateTime)

            const bookingData = await confirmBookingDetails.aggregate([
                {
                    $match: {
                        propertyId: propertyId,
                        otaId: otaId,
                        $expr: {
                            $and: [
                                { $gte: [{ $toDate: "$bookingTime" }, startDateTime] },
                                { $lt: [{ $toDate: "$bookingTime" }, endDateTime] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        roomTypeId: { $arrayElemAt: ["$roomTypeId.roomTypeId", 0] }, // Extract the roomTypeId from the 0th position,
                        bookingTime: 1,
                        reservationRate: 1,
                        nightCount: 1,
                    }
                }
            ]).exec();

            const roomTypeIds = bookingData.map(entry => entry.roomTypeId);
            console.log('roomTypeIds: ', roomTypeIds);

            // Fetch roomType details based on the extracted roomTypeIds
            const roomTypeDetails = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } });
            console.log('roomTypeDetails: ', roomTypeDetails);
            const roomTypeIdCounts = roomTypeIds.reduce((counts, roomTypeId) => {
                counts[roomTypeId] = (counts[roomTypeId] || 0) + 1;
                return counts;
            }, {});
            // Prepare the response object
            const responseData = roomTypeDetails.map(roomType => ({
                roomTypeId: roomType.roomTypeId,
                roomTypeName: roomType.roomTypeName[0].roomTypeName || '',
                count: roomTypeIdCounts[roomType.roomTypeId] || 0,
                // month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)
            }));

            return res.status(200).json({ data: responseData, statuscode: 200 });
        }
        return res.status(400).json({ message: "Please enter a valid filter", statuscode: 400 });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error', statuscode: 500 })
    }
}


export default getBestSellersData;
