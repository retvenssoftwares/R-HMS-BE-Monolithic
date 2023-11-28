import confirmBookingDetails from '../../../models/confirmBooking.js'
import propertyModel from "../../../models/property.js"
import { findUserByUserIdAndToken } from "../../../helpers/helper.js";
const overViewData = async (req, res) => {
    const { userId, propertyId, otaId } = req.query
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

        const specificDate = new Date().toISOString().split('T')[0]; // Replace with your specific date
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
                    bookingTime: 1
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

        // Prepare the response object
        const responseData = {
            totalRevenue: totalRevenue.toFixed(2), // Format the totalRevenue to 2 decimal places
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

export default overViewData