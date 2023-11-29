import { format, sub, getYear, getMonth } from "date-fns";
import confirmBooking from "../../../models/confirmBooking.js"
import { findUserByUserIdAndToken } from "../../../helpers/helper.js"
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
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
        console.log('currentDate: ', currentDate);
        const specificDate = convertTimestampToCustomFormat(
            currentDate.toISOString().split("T")[0],
            timeZone
        );

        const oneYearAgo = sub(currentDate, { years: 1 });
        const startOfYear = convertTimestampToCustomFormat(
            oneYearAgo.toISOString().split("T")[0],
            timeZone
        );
        console.log(specificDate, oneYearAgo, startOfYear)
        const endOfDay = `${specificDate} 23:59:59`;

        const getBookingData = await confirmBooking.aggregate([
            {
                $match: {
                    propertyId: propertyId,
                    otaId: otaId,
                    isOTABooking: "true",
                    $expr: {
                        $and: [
                            { $gte: [{ $toString: "$bookingTime" }, startOfYear] },
                            { $lt: [{ $toString: "$bookingTime" }, endOfDay] }
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
            return res.status(200).json({ message: "No data yet", statuscode: 200 })
        }
        // Calculate totalRevenue
        const totalRevenue = getBookingData.reduce((sum, booking) => {
            const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
            console.log(revenue)
            return sum + revenue;
        }, 0);

        const revenue = totalRevenue.toFixed(2);
        let previousYearRevenue
        let currentYearRevenue;
        let totalPreviousYearRevenue
        let totalCurrentYearRevenue
        if (filter === "Yearly") {
            previousYearRevenue = Array(12).fill(0);
            currentYearRevenue = Array(12).fill(0);

            getBookingData.forEach(booking => {
                const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
                const bookingDate = new Date(booking.bookingTime);
                const bookingYear = getYear(bookingDate);
                const bookingMonth = getMonth(bookingDate);

                if (bookingYear === getYear(oneYearAgo)) {
                    // Previous year's revenue
                    previousYearRevenue[bookingMonth] += revenue;
                }
                if (bookingYear === getYear(currentDate)) {
                    // Current year's revenue
                    currentYearRevenue[bookingMonth] += revenue;
                }
            });

            // Format the totalRevenue
            totalPreviousYearRevenue = previousYearRevenue.reduce((sum, revenue) => sum + revenue, 0).toFixed(2);
            totalCurrentYearRevenue = currentYearRevenue.reduce((sum, revenue) => sum + revenue, 0).toFixed(2);

        }

        // Prepare the response object
        const responseData = {
            totalRevenue: revenue, // Format the totalRevenue
            monthlyPreviousYearRevenue: previousYearRevenue.map(revenue => revenue.toFixed(2)),
            monthlyCurrentYearRevenue: currentYearRevenue.map(revenue => revenue.toFixed(2)),
            statuscode: 200
        };
        console.log(getBookingData);
        return res.status(200).json({ data: responseData, statuscode: 200 });

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default revenueOTAData;