import confirmBookingDetails from '../../../models/confirmBooking.js'
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import propertyModel from "../../../models/property.js"
import { findUserByUserIdAndToken } from "../../../helpers/helper.js";
const overViewData = async (req, res) => {
    const { userId, propertyId, otaId, timeZone } = req.query
    try {
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res
                .status(result.statuscode)
                .json({ message: result.message, statuscode: result.statuscode });
        }

        if (!otaId) {
            return res.status(400).json({ message: "Please enter otaId", statuscode: 400 });
        }
        const checkPropertyId = await propertyModel.findOne({ propertyId });
        if (!checkPropertyId) {
            return res.status(404).json({ message: "Incorrect propertyId entered", statuscode: 404 })
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
        // Replace with your specific date
        const specificDate = convertTimestampToCustomFormat(new Date().toISOString().split('T')[0], timeZone);
        console.log(specificDate)
        const startOfDay = `${specificDate} 00:00:00`;
        const endOfDay = `${specificDate} 23:59:59`;

        const getBookingData = await confirmBookingDetails.aggregate([
            {
                $match: {
                    propertyId: propertyId,
                    otaId: otaId,
                    isOTABooking: "true",
                    $expr: {
                        $and: [
                            { $gte: [{ $toString: "$bookingTime" }, startOfDay] },
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
                    nightCount: 1,
                    bookingTime: 1,
                    inventory: 1
                }
            }
        ]).exec();

        console.log(getBookingData);


        if (getBookingData.length < 0) {
            return res.status(200).json({ message: "No bookings yet", statuscode: 200 })
        }

        const mappedTotalRevenue = getBookingData.map(async (revenue) => {
            return {

                totalRevenue: revenue.reservationRate[0].roomCharges[0].grandTotal || ""
            }
        })
        // Calculate totalRevenue
        const totalRevenue = getBookingData.reduce((sum, booking) => {
            const revenue = parseFloat(booking.reservationRate[0].roomCharges[0].grandTotal) || 0;
            return sum + revenue;
        }, 0);

        const revenue = totalRevenue.toFixed(2);

        const totalNights = getBookingData.reduce((sum, nights) => {
            const numberOfNights = parseInt(nights.nightCount[0].nightCount) || 0;
            console.log(numberOfNights, typeof numberOfNights)
            return sum + numberOfNights;
        }, 0)

        console.log(totalNights, "adfsa")
        const adr = (revenue / parseInt(totalNights)).toFixed(2);
        console.log(adr)
        // Prepare the response object
        const responseData = {
            totalRevenue: revenue, // Format the totalRevenue
            averageDailyRate: adr || 0.00,
            statuscode: 200
        };

        const totalRevenuePromise = await Promise.all(mappedTotalRevenue)
        console.log(totalRevenuePromise.length)
        return res.status(200).json({ data: responseData, statuscode: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default overViewData;