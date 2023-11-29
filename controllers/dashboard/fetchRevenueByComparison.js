import bookingModel from "../../models/confirmBooking.js";
import moment from 'moment';

const RevenueData = async (req, res) => {
    const { propertyId, filter } = req.query;

    const currentDate = moment().toISOString(); // Get the exact current date in ISO format

    try {
        if (filter === 'yearly') {
            const currentYearStart = moment().startOf('year'); // Start of current year
            console.log(currentYearStart)
            const lastYearStart = moment().subtract(1,'years').startOf('year'); // Start of previous year
             console.log(lastYearStart)
            const [currentYearData, lastYearData] = await Promise.all([
                getYearlyRevenueData(propertyId, currentYearStart, currentDate),
                getYearlyRevenueData(propertyId, lastYearStart, currentYearStart.toISOString()),
            ]);

            if (currentYearData.length === 0 && lastYearData.length === 0) {
                return res.status(404).json({ message: "No revenue data found for the specified criteria." });
            }

            const completeCurrentYearData = fillMissingMonths(currentYearData, currentYearStart);
            const completeLastYearData = fillMissingMonths(lastYearData, lastYearStart);

            return res.status(200).json({ currentYearData: completeCurrentYearData, lastYearData: completeLastYearData });
        } else if (filter === 'monthly') {
            // ... (existing code for monthly data)
        } else if (filter === 'today') {
            // ... (existing code for daily data)
        } else {
            return res.status(400).json({ message: "Invalid filter value provided." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

const getYearlyRevenueData = async (propertyId, startDate, endDate) => {
    try {
        const revenueData = await bookingModel.aggregate([
            {
                $match: {
                    "propertyId": propertyId,
                    "checkInDate.checkInDate": {
                        $gte: startDate.toISOString(),
                        $lte: endDate,
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
                        $gte: startDate.toISOString(),
                        $lte: endDate,
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

        return revenueData;
    } catch (error) {
        throw error;
    }
};

const fillMissingMonths = (revenueData, yearStart) => {
    const months = [];
    const currentYear = moment().year();

    for (let i = 0; i < 12; i++) {
        const month = yearStart.clone().add(i, 'months').month() + 1; // Adding 1 to get months in 1-12 format

        const foundMonth = revenueData.find(data => data.month === month);
        if (foundMonth) {
            months.push(foundMonth);
        } else {
            months.push({ month, year: currentYear, totalRevenue: 0 });
        }
    }

    return months;
};




export default RevenueData;
