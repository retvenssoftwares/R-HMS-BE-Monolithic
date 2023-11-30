import bookingModel from "../../models/confirmBooking.js";
import moment from 'moment'; 
import roomTypeModel from '../../models/roomType.js'
const RevenueData = async (req, res) => {
    const { propertyId, filter } = req.query;

    const currentDate = moment().toISOString(); // Get the exact current date in ISO format
console.log(currentDate)
    try {
        if (filter === 'yearly') {
            // Set the start of the last year as January 1st of the previous year for yearly data
            const lastYearStart = moment().subtract(1, 'years')
            console.log(lastYearStart)
            
            const revenueData = await bookingModel.aggregate([
                {
                    $match: {
                        "propertyId": propertyId,
                        "checkInDate.checkInDate": {
                            $gte: lastYearStart.toISOString(),
                            $lte: currentDate,
                        },
                        isOTABooking: "true",
                        "roomTypeId.roomTypeId": { $exists: true, $ne: null, $ne: "" } // Filtering out empty or null roomTypeId
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
                    $unwind: "$nightCount" // Unwind the nightCount array
                },
                {
                    $group: {
                        _id: "$roomTypeId.roomTypeId", // Grouping by otaId
                        totalBooking:{$sum:1},
                        numberOfNights: { $sum: { $toInt: "$nightCount.nightCount" } } ,// Summing nightCount from the array after converting to integer
                        totalRevenue: { $sum: { $toDouble: "$reservationRate.roomCharges.grandTotal" } },
                    },
                },
          
                {
                    $project: {
                        roomTypeId: "$_id",
                        totalRevenue: 1,
                        totalBooking:1,
                        numberOfNights:1,// Calculating night count assuming dates are in milliseconds
                        los: { $divide: ["$numberOfNights", "$totalBooking"] } ,// Calculate LOs
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

            const roomTypeIds = revenueData.reduce((acc, entry) => {
                if (Array.isArray(entry.roomTypeId) && entry.roomTypeId.length > 0) {
                    acc.push(entry.roomTypeId[0]); // Push the first element of roomTypeId array
                }
                return acc;
            }, []);
            
            const roomTypes = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } }, { roomTypeId: 1, roomTypeName: 1 });
            console.log(roomTypes)
            const updatedData = revenueData.map(entry => {
                const roomType = roomTypes.find(room => room.roomTypeId === entry.roomTypeId[0]?.roomTypeId);
                console.log(roomType)
                const roomTypeName = roomType ? roomType.roomTypeName : '';
            
                const { roomTypeId, ...rest } = entry;
            
                return {
                    ...rest,
                    roomTypeId: roomTypeId[0]?.roomTypeId || '',
                    roomTypeName: roomTypeName,
                    numberOfNights: entry.numberOfNights,
                    totalBooking: entry.totalBooking,
                    totalRevenue: entry.totalRevenue,
                    // Add other fields you need here
                };
            });
            
            return res.status(200).json(updatedData);
            
        

    }else if (filter === 'monthly') {
     // Get the start and end of the last month
     const currentDate = moment();
     console.log(currentDate)
     const lastMonthDate =  currentDate.clone().subtract(30,'days')
     console.log(lastMonthDate)
        const revenueData = await bookingModel.aggregate([
            {
                $match: {
                    "propertyId": propertyId,
                    "checkInDate.checkInDate": {
                        $lte: currentDate.toISOString(),
                        $gte: lastMonthDate.toISOString(),
                    },
                    isOTABooking: "true"
                },
            },
            {
                $unwind: "$reservationRate"
            },
            {
                $unwind: "$reservationRate.roomCharges"
            },
            {
                $unwind: "$nightCount" // Unwind the nightCount array
            },
            {
                $group: {
                    _id: "$otaId",
                    totalBooking:{$sum:1},
                    totalRevenue: { $sum: { $toDouble: "$reservationRate.roomCharges.grandTotal" } },
                    numberOfNights: { $sum: { $toInt: "$nightCount.nightCount" } } ,
                },
            },
            {
                $project: {
                    otaId: "$_id",
                    totalBooking:1,
                    totalRevenue: 1,
                    numberOfNights:1,
                    otaName: { $arrayElemAt: ["$otaDetails.otaName", 0] },
                    otaLogo: { $arrayElemAt: ["$otaDetails.otaLogo", 0] },
                    los: { $divide: ["$numberOfNights", "$totalBooking"] } ,// Calculate LOs
                    _id: 0,
                },
            }
        ]);
       

        if (revenueData.length === 0) {
            return res.status(404).json({ message: "No revenue data found for the specified criteria." });
        }
        const otaIds = revenueData.map(entry => entry.otaId); // Extracting otaIds from revenueData

        const otaDetailsPromises = otaIds.map(otaId =>
            otaModel.findOne({ "otaId.otaId": otaId }, { _id: 0, otaId: 1, "otaName.otaName": 1, "otaLogo.otaLogo": 1 })
        );

        const otaDetails = await Promise.all(otaDetailsPromises);

        // Merging otaDetails with revenueData based on otaId
        const mergedData = revenueData.map((revenueEntry, index) => {
            const otaDetail = otaDetails[index];

            if (!otaDetail) {
                // Handle case where otaDetail is not found for a specific otaId
                console.log(`No OTA details found for otaId: ${revenueEntry.otaId}`);
            }

            return {
                ...revenueEntry,
                numberOfNights:revenueEntry.numberOfNights,
                totalBooking: revenueEntry.totalBooking,
                totalRevenue: revenueEntry.totalRevenue,
                otaName: otaDetail ? otaDetail.otaName[0]?.otaName : '',
                otaLogo: otaDetail ? otaDetail.otaLogo[0]?.otaLogo : ''
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
