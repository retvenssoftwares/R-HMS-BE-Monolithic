import bookingModel from "../../models/confirmBooking.js";
import moment from 'moment';
import verifiedUser from "../../models/verifiedUsers.js";
import {findUserByUserIdAndToken,validateHotelCode } from "../../helpers/helper.js";
const RevenueData = async (req, res) => {
    const { propertyId, filter,userId } = req.query;
    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser || !userId) {
      return res
        .status(404)
        .json({ message: "User not found or invalid userId", statuscode: 404 });
    }
    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    const currentDate = moment().toISOString(); // Get the exact current date in ISO format
// Get the last month of the current year
const lastMonthOfCurrentYear = moment().endOf('year');
const results = await validateHotelCode(userId, propertyId)
if (!results.success) {
    return res.status(results.statuscode).json({ message: "Invalid propertyId entered", statuscode: results.statuscode })
}
    try {
        if (result.success) {
        if (filter === 'yearly') {
            const currentYearStart = moment().startOf('year'); // Start of current year
           // console.log(currentYearStart)
            const lastYearStart = moment().subtract(1,'years').startOf('year'); // Start of previous year
           //  console.log(lastYearStart)
            const [currentYearData, lastYearData] = await Promise.all([
                getYearlyRevenueData(propertyId, currentYearStart, lastMonthOfCurrentYear.toISOString()),
                getYearlyRevenueData(propertyId, lastYearStart, currentYearStart.toISOString()),
            ]);
          //  console.log(currentYearData)
           // console.log(lastYearData)

            if (currentYearData.length === 0 && lastYearData.length === 0) {
                return res.status(404).json({ message: "No revenue data found for the specified criteria." });
            }

            const completeCurrentYearData = fillMissingMonths(currentYearData, currentYearStart);
            const completeLastYearData = fillMissingMonths(lastYearData, lastYearStart, true);

            return res.status(200).json({ currentYearData: completeCurrentYearData, lastYearData: completeLastYearData });
        } else if (filter === 'monthly') {
           const currentMonthStart = moment().startOf('month');
            const lastMonthStart = moment().subtract(1, 'months').startOf('month');

            const { currentMonthData, lastMonthData } = await getMonthlyRevenueData(propertyId, currentMonthStart, lastMonthStart);
            

            return res.status(200).json({ currentMonthData, lastMonthData });
        } else if (filter === 'today') {
            // ... (existing code for daily data)
        } else {
            return res.status(400).json({ message: "Invalid filter value provided." });
        }
    } else {
        return res
          .status(result.statuscode)
          .json({ message: result.message, statuscode: result.statuscode });
      }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};


//yearly data function
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

const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  
// missing function for yearly
const fillMissingMonths = (revenueData, yearStart, isLastYear = false) => {
    const months = [];
    const currentYear = moment().year();
    const year = isLastYear ? currentYear - 1 : currentYear;

    for (let i = 1; i <= 12; i++) {
        const foundMonth = revenueData.find(data => data.month === i);
        if (foundMonth) {
            // Replace numeric month with month name
            const monthName = monthNames[i - 1]; // Arrays are zero-indexed
            months.push({ ...foundMonth, month: monthName });
        } else {
            const monthName = monthNames[i - 1];
            months.push({ month: monthName, year, totalRevenue: 0 });
        }
    }

    return months;
};



//function for monthly

    const getMonthlyRevenueData = async (propertyId, currentMonthStart, lastMonthStart) => {
        try {
            const [currentMonthData, lastMonthData] = await Promise.all([
                getDailyRevenueData(propertyId, currentMonthStart, moment().toISOString()),
                getDailyRevenueData(propertyId, lastMonthStart, currentMonthStart.toISOString()),
            ]);
    
            const completeCurrentMonthData = fillMissingDays(currentMonthData, currentMonthStart);
            const completeLastMonthData = fillMissingDays(lastMonthData, lastMonthStart, true);
    
            return { currentMonthData: completeCurrentMonthData, lastMonthData: completeLastMonthData };
        } catch (error) {
            throw error;
        }
    };


    //function for monthly 
const getDailyRevenueData = async (propertyId, startDate, endDate) => {
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
                    day: { $dayOfMonth: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
                    month: { $month: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
                    year: { $year: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
                    grandTotal: { $toDouble: "$reservationRate.roomCharges.grandTotal" },
                },
            },
            {
                $group: {
                    _id: { day: "$day", month: "$month", year: "$year" },
                    totalRevenue: { $sum: "$grandTotal" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
            {
                $project: {
                    day: "$_id.day",
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


//monthly
const fillMissingDays = (revenueData, monthStart, isLastMonth = false) => {
    const daysInMonth = moment(monthStart).daysInMonth();
    const currentYear = moment().year();
    const currentMonth = moment().month() + 1;
    let monthToDisplay = currentMonth;

    if (isLastMonth) {
        const lastMonthData = revenueData.find(data => data.totalRevenue > 0);
        if (lastMonthData) {
            monthToDisplay = currentMonth - 1;
        }
    }

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const foundDay = revenueData.find(data => data.day === i);
        if (foundDay) {
            const monthName = monthNames[foundDay.month - 1];
            days.push({ ...foundDay, month: monthName });
        } else {
            const monthName = monthNames[monthToDisplay - 1];
            days.push({ day: i, month: monthName, year: currentYear, totalRevenue: 0 });
        }
    }

    return days;
};



export default RevenueData;
