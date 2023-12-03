import bookingModel from "../../models/confirmBooking.js";
import moment from 'moment'; 
import roomTypeModel from '../../models/roomType.js'
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
                        _id: "$roomTypeId.roomTypeId", // Grouping by roomTypeId
                        totalBooking:{$sum:1},
                        numberOfNights: { $sum: { $toInt: "$nightCount.nightCount" } } ,// Summing nightCount from the array after converting to integer
                        totalRevenue: { $sum: { $toDouble: "$reservationRate.roomCharges.grandTotal" } },
                    },
                },
          
                {
                    $project: {
                        roomTypeId: { $arrayElemAt: ["$_id", 0] },
                        totalRevenue: 1,
                        totalBooking:1,
                        numberOfNights:1,// Calculating night count assuming dates are in milliseconds
                        los: { $divide: ["$numberOfNights", "$totalBooking"] } ,// Calculate LOs
                        _id: 0
                    }
                },
            ]);
           

            if (revenueData.length === 0) {
                return res.status(404).json({ message: "No revenue data found for the specified criteria." });
            }
            console.log(revenueData)

       const roomTypeIds = await revenueData.map((item)=>item.roomTypeId)
            // console.log(roomTypeIds)
            const roomTypes = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } }, { roomTypeId: 1, roomTypeName: 1 });
           // console.log(roomTypes)
            const updatedData = revenueData.map(entry => {
                const roomType = roomTypes.find(room => room.roomTypeId ===entry.roomTypeId);
                
                
                const roomTypeName = roomType ? roomType.roomTypeName[0].roomTypeName : '';
                const roomTypeId = roomType ? roomType.roomTypeId : '';
            
                const {  ...rest } = entry;
            
                return {
                    ...rest,
                    roomTypeId:roomTypeId ,
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
                    isOTABooking: "true",
                    "roomTypeId.roomTypeId": { $exists: true, $ne: null, $ne: "" }
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
                    _id: "$roomTypeId.roomTypeId", // Grouping by roomTypeId
                    totalBooking:{$sum:1},
                    totalRevenue: { $sum: { $toDouble: "$reservationRate.roomCharges.grandTotal" } },
                    numberOfNights: { $sum: { $toInt: "$nightCount.nightCount" } } ,
                },
            },
            {
                $project: {
                    roomTypeId: { $arrayElemAt: ["$_id", 0] },
                    totalBooking:1,
                    totalRevenue: 1,
                    numberOfNights:1, 
                    los: { $divide: ["$numberOfNights", "$totalBooking"] } ,// Calculate LOs
                    _id: 0,
                },
            }
        ]);
       

        if (revenueData.length === 0) {
            return res.status(404).json({ message: "No revenue data found for the specified criteria." });
        }
     
        const roomTypeIds = await revenueData.map((item)=>item.roomTypeId)
        // console.log(roomTypeIds)
        const roomTypes = await roomTypeModel.find({ roomTypeId: { $in: roomTypeIds } }, { roomTypeId: 1, roomTypeName: 1 });
       // console.log(roomTypes)
        const updatedData = revenueData.map(entry => {
            const roomType = roomTypes.find(room => room.roomTypeId ===entry.roomTypeId);
            
            
            const roomTypeName = roomType ? roomType.roomTypeName[0].roomTypeName : '';
            const roomTypeId = roomType ? roomType.roomTypeId : '';
        
            const {  ...rest } = entry;
        
            return {
                ...rest,
                roomTypeId:roomTypeId ,
                roomTypeName: roomTypeName,
                numberOfNights: entry.numberOfNights,
                totalBooking: entry.totalBooking,
                totalRevenue: entry.totalRevenue,
                // Add other fields you need here
            };
        });
        
        return res.status(200).json(updatedData);
}
        else {
            return res.status(400).json({ message: "Invalid filter value provided." });
        }
    }else {
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
