import bookingModel from "../../models/confirmBooking.js";
import moment from 'moment';

const RevenueData = async (req, res) => {
    const { propertyId, filter } = req.query;

    const currentDate = moment().toISOString(); // Get the exact current date in ISO format

    try {
        if (filter === 'yearly') {
            // Set the start of the last year as January 1st of the previous year for yearly data
            const lastYearStart = moment().subtract(1, 'years').startOf('year').toDate();

            const revenueData = await bookingModel.aggregate([
                {
                    $match: {
                        "propertyId": propertyId,
                        "checkInDate.checkInDate": {
                            $gte: lastYearStart.toISOString(),
                            $lte: currentDate,
                        },
                        isOTABooking: "true"
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
                {
                    $project: {
                        month: "$_id.month",
                        year: "$_id.year",
                        totalRevenue: 1,
                        _id: 0, // Exclude _id
                    },
                },
            ]);

            if (revenueData.length === 0) {
                return res.status(404).json({ message: "No revenue data found for the specified criteria." });
            }

            return res.status(200).json(revenueData);
        } else if (filter === 'monthly') {
            // Get the start and end of the last month
            const lastMonthStart = moment().subtract(1, 'months').startOf('month');
            const lastMonthEnd = moment().subtract(1, 'months').endOf('month');

            const revenueData = await bookingModel.aggregate([
                {
                    $match: {
                        "propertyId": propertyId,
                        "checkInDate.checkInDate": {
                            $gte: lastMonthStart.toISOString(),
                            $lte: lastMonthEnd.toISOString(),
                        },
                        isOTABooking: "true"
                    },
                },
                {
                    $unwind: "$checkInDate" // Unwind the checkInDate array
                },
                {
                    $match: {
                        "checkInDate.checkInDate": {
                            $gte: lastMonthStart.toISOString(),
                            $lte: lastMonthEnd.toISOString(),
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
                        week: { $week: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
                        month: { $month: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
                        grandTotal: { $toDouble: "$reservationRate.roomCharges.grandTotal" },
                    },
                },
                {
                    $group: {
                        _id: { month: "$month", week: "$week" },
                        totalRevenue: { $sum: "$grandTotal" },
                    },
                },
                {
                    $sort: { "_id": 1 },
                },

                {
                    $project: {
                        month: "$_id.month",
                        week: "$_id.week",
                        totalRevenue: 1,
                        _id: 0, // Exclude _id
                    },
                }
            ]);

            if (revenueData.length === 0) {
                return res.status(404).json({ message: "No revenue data found for the specified criteria." });
            }

            return res.status(200).json(revenueData);
        }else if (filter === 'today') {
            // Get start and end of today
            const todayStart = moment().startOf('day');
            const todayEnd = moment().endOf('day');

            const revenueData = await bookingModel.aggregate([
                {
                    $match: {
                        "propertyId": propertyId,
                        "checkInDate.checkInDate": {
                            $gte: todayStart.toISOString(),
                            $lte: todayEnd.toISOString(),
                        },
                        isOTABooking: "true"
                    },
                },
                {
                    $unwind: "$checkInDate" // Unwind the checkInDate array
                },
                {
                    $match: {
                        "checkInDate.checkInDate": {
                            $gte: todayStart.toISOString(),
                            $lte: todayEnd.toISOString(),
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
                    $group: {
                        _id: "todays", // Group all documents
                        totalRevenue: { $sum: { $toDouble: "$reservationRate.roomCharges.grandTotal" } },
                    },
                },
            ]);

            if (revenueData.length === 0) {
                return res.status(404).json({ message: "No revenue data found for the specified criteria." });
            }

            return res.status(200).json(revenueData);
        } 
        
        else {
            return res.status(400).json({ message: "Invalid filter value provided." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default RevenueData;
