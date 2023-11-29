import bookingModel from "../../models/confirmBooking.js";
import moment from 'moment';
import otaModel from "../../models/superAdmin/otaModel.js"
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
                    $group: {
                        _id: "$otaId", // Grouping by otaId
                        totalBooking:{$sum:1},
                        totalRevenue: { $sum: { $toDouble: "$reservationRate.roomCharges.grandTotal" } },
                    },
                },
                {
                    $lookup: {
                        from: "otas", // Collection name in your database
                        localField: "_id",
                        foreignField: "otaId",
                        as: "otaDetails"
                    }
                },
                {
                    $project: {
                        otaId: "$_id",
                        totalRevenue: 1,
                        totalBooking:1,
                        otaName: { $arrayElemAt: ["$otaDetails.otaName", 0] },
                        otaLogo: { $arrayElemAt: ["$otaDetails.otaLogo", 0] },
                        _id: 0
                    }
                },
                {
                    $sort: { "otaId": 1 }
                }
            ]);

            if (revenueData.length === 0) {
                return res.status(404).json({ message: "No revenue data found for the specified criteria." });
            }

            const otaIds = revenueData.map(entry => entry.otaId); // Extracting otaIds from revenueData

            //////
             const otaDetails = await otaModel.aggregate([
                {
                    $match: {
                        "otaId.otaId": { $in: otaIds }
                    }
                },
                {
                    $project: {
                        otaId: "$otaId.otaId",
                        otaName: "$otaName.otaName",
                        otaLogo: "$otaLogo.otaLogo",
                        _id: 0
                    }
                }
            ]);
            console.log(otaDetails)
             // Merging otaDetails with revenueData based on otaId
                    // Creating a new array with merged data
        const mergedData = revenueData.map(entry => {
            const otaDetail = otaDetails.find(ota => ota.otaId?.otaId === entry.otaId);
            return {
                otaId: entry.otaId,
                totalBooking: entry.totalBooking,
                totalRevenue: entry.totalRevenue,
                otaName: otaDetail ? otaDetail.otaName : null,
                otaLogo: otaDetail ? otaDetail.otaLogo : null
            };
        });

        return res.status(200).json(mergedData);
        

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
