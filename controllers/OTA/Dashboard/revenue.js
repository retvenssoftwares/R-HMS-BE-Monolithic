import { format, sub, getYear, getMonth } from "date-fns";
import confirmBooking from "../../../models/confirmBooking.js";
import { findUserByUserIdAndToken } from "../../../helpers/helper.js";
import { utcToZonedTime } from "date-fns-tz";

const revenueOTAData = async (req, res) => {
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
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0);
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

        // console.log(startOfYear.toISOString(), endOfDay.toISOString(), "cgffxf");

        // const currentDate = new Date();
        const startOfPreviousYear = new Date(currentDate.getFullYear() - 1, 0, 1, 0, 0, 0);
        const endOfPreviousYear = new Date(currentDate.getFullYear(), 0, 0, 23, 59, 59);

        // console.log(startOfPreviousYear.toISOString(), endOfPreviousYear.toISOString(), "vhjvghjvj");

        // const endOfDay = `${specificDate} 23:59:59`;
        // console.log(startOfYear, endOfDay, "sdfsd")

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
                    inventory: 1
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
                    inventory: 1
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

            const revenue = totalRevenue.toFixed(2);

            // Calculate totalRevenue for the previous year
            const totalPreviousYearRevenue = getBookingDataPreviousYear.reduce((sum, booking) => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                return sum + revenue;
            }, 0).toFixed(2);

            // Calculate monthly revenue for the current year
            let currentYearRevenue = Array(12).fill(0);
            getBookingData.forEach(booking => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                const bookingDate = new Date(booking.bookingTime);
                const bookingMonth = getMonth(bookingDate);
                currentYearRevenue[bookingMonth] += revenue;
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
                const date = new Date(currentDate.getFullYear(), i, 1);
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
                revenueStatus: revenueStatus,
                percentage: percentage.toFixed(2),
                yearlyData: [
                    {
                        year: getYear(oneYearAgo),
                        monthlyRevenue: previousYearRevenue.map((revenue, index) => ({
                            month: monthNames[index],
                            revenue: revenue.toFixed(2)
                        })),
                        // totalRevenue: totalPreviousYearRevenue
                    }, {
                        year: getYear(currentDate),
                        monthlyRevenue: currentYearRevenue.map((revenue, index) => ({
                            month: monthNames[index],
                            revenue: revenue.toFixed(2)
                        })),
                        // totalRevenue: totalCurrentYearRevenue
                    }
                ],
            };
            // console.log(getBookingData)
            // console.log(getBookingDataPreviousYear, "zdsfasd")
            // console.log()
            return res.status(200).json({ data: responseData, statuscode: 200 });

        }

        return res.status(400).json({ message: "Please enter a valid filter", statuscode: 400 })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default revenueOTAData;
