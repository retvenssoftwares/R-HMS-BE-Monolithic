import { format, sub, getYear, getMonth } from "date-fns";
import confirmBooking from "../../../models/confirmBooking.js";
import { findUserByUserIdAndToken } from "../../../helpers/helper.js";
import { utcToZonedTime } from "date-fns-tz";

const adrOtaData = async (req, res) => {
    try {
        const { userId, propertyId, otaId, filter, timeZone } = req.query;
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        if (!propertyId && !otaId) {
            return res.status(400).json({ message: "Please enter propertyId and otaId", statuscode: 400 });
        }
        function convertTimestampToCustomFormat(utcTimestamp, targetTimeZone) {
            // Convert the UTC timestamp to the target time zone
            const zonedTimestamp = utcToZonedTime(utcTimestamp, targetTimeZone);

            // Define the custom format
            const customFormat = "yyyy-MM-dd";

            // Format the zoned timestamp into the custom format
            const formattedTimestamp = format(zonedTimestamp, customFormat, {
                timeZone: targetTimeZone,
            });

            return formattedTimestamp;
        }

        // Get the specific date and one year ago from that date
        const currentDate = new Date();
        const specificDate = convertTimestampToCustomFormat(
            currentDate.toISOString().split("T")[0],
            timeZone
        );

        const oneYearAgo = sub(currentDate, { years: 1 });
        const startOfYear = new Date(currentDate);
        startOfYear.setDate(currentDate.getDate() - 365);
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);


        // const currentDate = new Date();
        const startOfPreviousYear = new Date(currentDate.getFullYear() - 1, 0, 1, 0, 0, 0);
        const endOfPreviousYear = new Date(currentDate.getFullYear(), 0, 0, 23, 59, 59);

       

        // Aggregate for the current year (2023)
        const getBookingData = await confirmBooking.aggregate([
            {
                $match: {
                    propertyId: propertyId,
                    otaId: otaId,
                    isOTABooking: "true",
                    $expr: {
                        $and: [
                            { $gte: [{ $toString: "$bookingTime" }, startOfYear.toISOString()] },
                            { $lt: [{ $toString: "$bookingTime" }, endOfDay.toISOString()] }
                        ]
                    }
                }
            },
            {
                $project: {
                    reservationRate: 1,
                    propertyId: 1,
                    otaId: 1,
                    bookingTime: 1,
                    inventory: 1,
                    nightCount:1

                }
            }
        ]).exec();

        // Aggregate for the previous year (2022)
        const getBookingDataPreviousYear = await confirmBooking.aggregate([
            {
                $match: {
                    propertyId: propertyId,
                    otaId: otaId,
                    isOTABooking: "true",
                    $expr: {
                        $and: [
                            { $gte: [{ $toString: "$bookingTime" }, startOfPreviousYear.toISOString()] },
                            { $lt: [{ $toString: "$bookingTime" }, endOfPreviousYear.toISOString()] }
                        ]
                    }
                }
            },
            {
                $project: {
                    reservationRate: 1,
                    propertyId: 1,
                    otaId: 1,
                    bookingTime: 1,
                    inventory: 1,
                    nightCount:1
                }
            }
        ]).exec();

        if (getBookingData.length < 0) {
            return res.status(200).json({ message: "No data yet", statuscode: 200 });
        }

        //YTD
        if (filter === "Yearly") {
            // Calculate totalRevenue for the current year
            const totalRevenue = getBookingData.reduce((sum, booking) => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                return sum + revenue;
            }, 0);
            const totalNightCount = getBookingData.reduce((sum, booking) => {
                const nightCount = parseFloat(booking.nightCount[0].nightCount) || 0;
                return sum + nightCount;
            }, 0);

            const revenue = totalRevenue.toFixed(2);
            const ADR =parseFloat( revenue / totalNightCount).toString();

            // Calculate totalRevenue for the previous year
            const totalPreviousYearRevenue = getBookingDataPreviousYear.reduce((sum, booking) => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                return sum + revenue;
            }, 0).toFixed(2);

            // Calculate monthly revenue for the current year
            let currentYearRevenue = Array(12).fill(0);
            let currentYearNightCount=Array(12).fill(0)
            getBookingData.forEach(booking => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                const nightCount=parseInt(booking.nightCount[0].nightCount) || 0
                const bookingDate = new Date(booking.bookingTime);
                const bookingMonth = getMonth(bookingDate);
                currentYearRevenue[bookingMonth] += revenue;
                currentYearNightCount[bookingMonth]+=nightCount;
            });

            // Calculate monthly revenue for the previous year
            let previousYearRevenue = Array(12).fill(0);
            getBookingDataPreviousYear.forEach(booking => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                const bookingDate = new Date(booking.bookingTime);
                const bookingMonth = getMonth(bookingDate);
                previousYearRevenue[bookingMonth] += revenue;
            });

            // Format the totalRevenue for the current year
            const totalCurrentYearRevenue = currentYearRevenue.reduce((sum, revenue) => sum + revenue, 0).toFixed(2);

            // Get month names
            const monthNames = Array.from({ length: 12 }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), +i, 1);
                return format(date, 'MMMM');
            });

            var revenueStatus = "loss"
            console.log(totalCurrentYearRevenue, totalPreviousYearRevenue)
            if (parseFloat(totalCurrentYearRevenue) > parseFloat(totalPreviousYearRevenue)) {
                revenueStatus = "profit"
            }

            const percentage = ((parseFloat(totalCurrentYearRevenue) - parseFloat(totalPreviousYearRevenue)) / Math.abs(parseFloat(totalPreviousYearRevenue))) * 100;
            // Prepare the response object
            const responseData = {
                totalRevenue: revenue,
                ADR:ADR,
                revenueStatus: revenueStatus,
                percentage: percentage.toFixed(2),
                yearlyData: [
                    {
                        year: getYear(currentDate),
                        monthlyRevenue: currentYearRevenue.map((revenue, index) => ({
                            month: monthNames[index],
                            revenue: revenue.toFixed(2),
                            ADR: currentYearNightCount[index] > 0 ? parseFloat(revenue / currentYearNightCount[index]).toString() : 0,
                        })),  
                        // totalRevenue: totalCurrentYearRevenue
                    }
                ],
            };
           
            return res.status(200).json({ data: responseData, statuscode: 200 });

        }
        else if (filter === "Monthly") {
            // Calculate the start and end dates for the current month
            const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
            const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

            // Calculate the start and end dates for the previous month
            const startOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1, 0, 0, 0);
            const endOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 23, 59, 59);

            // Aggregate for the current month (2023-11)
            const getBookingDataCurrentMonth = await confirmBooking.aggregate([
                {
                    $match: {
                        propertyId: propertyId,
                        otaId: otaId,
                        isOTABooking: "true",
                        $expr: {
                            $and: [
                                { $gte: [{ $toString: "$bookingTime" }, startOfCurrentMonth.toISOString()] },
                                { $lt: [{ $toString: "$bookingTime" }, endOfCurrentMonth.toISOString()] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        reservationRate: 1,
                        propertyId: 1,
                        otaId: 1,
                        bookingTime: 1,
                        inventory: 1,
                        nightCount:1
                    }
                }
            ]).exec();

            // Aggregate for the previous month (2023-10)
            const getBookingDataPreviousMonth = await confirmBooking.aggregate([
                {
                    $match: {
                        propertyId: propertyId,
                        otaId: otaId,
                        isOTABooking: "true",
                        $expr: {
                            $and: [
                                { $gte: [{ $toString: "$bookingTime" }, startOfPreviousMonth.toISOString()] },
                                { $lt: [{ $toString: "$bookingTime" }, endOfPreviousMonth.toISOString()] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        reservationRate: 1,
                        propertyId: 1,
                        otaId: 1,
                        bookingTime: 1,
                        inventory: 1
                    }
                }
            ]).exec();

            // Calculate daily revenue for the current month
            let currentMonthRevenue = Array(endOfCurrentMonth.getDate()).fill(0);
            let currentMonthNightCount = Array(endOfCurrentMonth.getDate()).fill(0);
            getBookingDataCurrentMonth.forEach(booking => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                const nightCount=parseInt(booking.nightCount[0].nightCount) || 0;
                const bookingDate = new Date(booking.bookingTime);
                const dayOfMonth = bookingDate.getDate();
                currentMonthRevenue[dayOfMonth - 1] += revenue;
                currentMonthNightCount[dayOfMonth - 1] += nightCount;
            });

            // Calculate daily revenue for the previous month
            let previousMonthRevenue = Array(endOfPreviousMonth.getDate()).fill(0);
            getBookingDataPreviousMonth.forEach(booking => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                const bookingDate = new Date(booking.bookingTime);
                const dayOfMonth = bookingDate.getDate();
                previousMonthRevenue[dayOfMonth - 1] += revenue;
             });

            // Calculate total revenue for the current month
            const totalCurrentMonthRevenue = currentMonthRevenue.reduce((sum, revenue) => sum + parseFloat(revenue), 0).toFixed(2);

            // Calculate total revenue for the previous month
            const totalPreviousMonthRevenue = previousMonthRevenue.reduce((sum, revenue) => sum + parseFloat(revenue), 0).toFixed(2);

            // Calculate percentage increase or decrease
            const revenueStatus = parseFloat(totalCurrentMonthRevenue) > parseFloat(totalPreviousMonthRevenue) ? "profit" : "loss";
            const percentage = ((totalCurrentMonthRevenue - totalPreviousMonthRevenue) / Math.abs(totalPreviousMonthRevenue)) * 100;

            // Get the month names
            const currentMonthName = format(startOfCurrentMonth, 'MMMM');
            
            // Prepare the response object
            const responseData = {
                totalRevenue: totalCurrentMonthRevenue,
                revenueStatus: revenueStatus,
                percentage: percentage.toFixed(2),
                monthlyData: [
                   
                    {
                        month: currentMonthName,
                        dailyRevenue: currentMonthRevenue.map((revenue, index) => ({
                            day: index + 1,
                            revenue: revenue.toFixed(2),
                            ADR: currentMonthNightCount[index] > 0 ? parseFloat(revenue / currentMonthNightCount[index]).toString() : 0,
                        })),
                    },
                ],
            };

            return res.status(200).json({ data: responseData, statuscode: 200 });
         }
        
        else if (filter === "Daily") {
            const startOfCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
            const endOfCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
        
            const getBookingDataCurrentDate = await confirmBooking.aggregate([
                {
                    $match: {
                        propertyId: propertyId,
                        otaId: otaId,
                        isOTABooking: "true",
                        bookingTime: {
                            $gte: startOfCurrentDay,
                            $lt: endOfCurrentDay
                        }
                    }
                },
                {
                    $project: {
                        reservationRate: 1,
                        nightCount: 1
                    }
                }
            ]).exec();
        
            let totalRevenue = 0;
            let totalNightCount = 0;
        
            getBookingDataCurrentDate.forEach(booking => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                const nightCount = parseInt(booking.nightCount[0].nightCount) || 0;
        
                totalRevenue += revenue;
                totalNightCount += nightCount;
            });
        
            const ADR = totalNightCount > 0 ? (totalRevenue / totalNightCount).toFixed(2) : 0;
        
            const responseData = {
                totalRevenue: totalRevenue.toFixed(2),
                ADR: ADR
            };
        
            return res.status(200).json({ data: responseData, statuscode: 200 });
        }
        

        return res.status(400).json({ message: "Please enter a valid filter", statuscode: 400 })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default adrOtaData;
