import bookingModel from "../../models/confirmBooking.js";
import moment from 'moment';

const RevenueData = async (req, res) => {
    const { propertyId } = req.query;
    const currentDate = moment().toISOString(); // Get the exact current date in ISO format
console.log(currentDate)
    // Set the start of the last year as November 1st of the previous year
    const lastYearStart = moment().subtract(1, 'years').startOf('year').add(11, 'months').toDate(); // November 1st of the last year
console.log(lastYearStart)
    try {
        const revenueData = await bookingModel.aggregate([
            {
                $match: {
                    "propertyId": propertyId,
                    "checkInDate.checkInDate": {
                        $gte: lastYearStart.toISOString(),
                        $lte: currentDate,
                    },
                    isOTABooking:"true"
                },
            },
            {
                $unwind: "$checkInDate" // Unwind the checkInDate array
            },
            {
                $match: {
                    "checkInDate.checkInDate": {
                        $gte: lastYearStart.toISOString(),
                        $lte: currentDate,
                    }
                }
            },
            {
                $unwind: "$reservationRate"
            },
            {
                $unwind: "$reservationRate.roomCharges"
            },
            {
                $project: {
                    month: { $month: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
                    year: { $year: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
                    grandTotal: { $toDouble: "$reservationRate.roomCharges.grandTotal" },
                },
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year" },
                    totalRevenue: { $sum: "$grandTotal" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
        ]);

        if (revenueData.length === 0) {
            return res.status(404).json({ message: "No revenue data found for the specified criteria." });
        }

        res.status(200).json(revenueData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default RevenueData;
