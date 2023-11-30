// import bookingModel from "../../models/confirmBooking.js";
// import moment from 'moment';

// const RevenueData = async (req, res) => {
//     const { propertyId,filter } = req.query;

//     const currentDate = moment().toISOString(); // Get the exact current date in ISO format
// console.log(currentDate)
//     // Set the start of the last year as November 1st of the previous year
//     const lastYearStart = moment().subtract(1, 'years').startOf('year').add(11, 'months').toDate(); // November 1st of the last year
// console.log(lastYearStart)
//     try {
//         const revenueData = await bookingModel.aggregate([
//             {
//                 $match: {
//                     "propertyId": propertyId,
//                     "checkInDate.checkInDate": {
//                         $gte: lastYearStart.toISOString(),
//                         $lte: currentDate,
//                     },
//                     isOTABooking:"true"
//                 },
//             },
//             {
//                 $unwind: "$checkInDate" // Unwind the checkInDate array
//             },
//             {
//                 $match: {
//                     "checkInDate.checkInDate": {
//                         $gte: lastYearStart.toISOString(),
//                         $lte: currentDate,
//                     }
//                 }
//             },
//             {
//                 $unwind: "$reservationRate"
//             },
//             {
//                 $unwind: "$reservationRate.roomCharges"
//             },
//             {
//                 $project: {
//                     month: { $month: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
//                     year: { $year: { $dateFromString: { dateString: "$checkInDate.checkInDate" } } },
//                     grandTotal: { $toDouble: "$reservationRate.roomCharges.grandTotal" },
//                 },
//             },
//             {
//                 $group: {
//                     _id: { month: "$month", year: "$year" },
//                     totalRevenue: { $sum: "$grandTotal" },
//                 },
//             },
//             {
//                 $sort: { "_id.year": 1, "_id.month": 1 },
//             },
//         ]);

//         if (revenueData.length === 0) {
//             return res.status(404).json({ message: "No revenue data found for the specified criteria." });
//         }

//         res.status(200).json(revenueData);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
//     }
// };

// export default RevenueData;



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
    const results = await validateHotelCode(userId, propertyId)
            if (!results.success) {
                return res.status(results.statuscode).json({ message: "Invalid propertyId entered", statuscode: results.statuscode })
            }
    try {
        if (result.success) {
        if (filter === 'yearly') {
            // Set the start of the last year as January 1st of the previous year for yearly data
            const lastYearStart = moment().subtract(1, 'years').startOf(1,'year').toDate();

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
            const currentDate = moment();
            const lastMonthDate =  currentDate.clone().subtract(30,'days')
   
            const revenueData = await bookingModel.aggregate([
                {
                    $match: {
                        "propertyId": propertyId,
                        "checkInDate.checkInDate": {
                            $gte: lastMonthDate.toISOString(),
                            $lte: currentDate.toISOString(),
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
                            $gte: lastMonthDate.toISOString(),
                            $lte: currentDate.toISOString(),
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
                        day: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $dateFromString: { dateString: "$checkInDate.checkInDate" } }
                            }
                        },
                        grandTotal: { $toDouble: "$reservationRate.roomCharges.grandTotal" },
                    },
                },
                {
                    $group: {
                        _id: { day: "$day" },
                        totalRevenue: { $sum: "$grandTotal" },
                    },
                },
                {
                    $sort: { "_id.day": 1 },
                },
                {
                    $project: {
                        day: "$_id.day",
                        totalRevenue: 1,
                        _id: 0, // Exclude _id
                    },
                }
            ]);

            if (revenueData.length === 0) {
                return res.status(404).json({ message: "No revenue data found for the specified criteria." });
            }

           // Generate an array of dates within the range
    const datesInRange = [];
    let tempDate = lastMonthDate.clone();
    while (tempDate.isSameOrBefore(currentDate, 'day')) {
        datesInRange.push(tempDate.format('YYYY-MM-DD'));
        tempDate.add(1, 'day');
    }

    // Create a map to store revenue data by date
    const revenueMap = new Map(revenueData.map(item => [item.day, item.totalRevenue]));

    // Fill missing dates with zero revenue
    const revenueWithMissingDates = datesInRange.map(date => ({
        day: date,
        totalRevenue: revenueMap.get(date) || 0
    }));

    return res.status(200).json(revenueWithMissingDates);
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

export default RevenueData;
