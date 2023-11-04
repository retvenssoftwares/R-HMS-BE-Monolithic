// import barRateModel from '../../models/barRatePlan.js';
// import rateModel from '../../models/manageRatesAndRestrictions.js';

// const checkRate = async (req, res) => {
//   const { propertyId, checkInDate, checkOutDate } = req.query;

//   try {
//     const ratePlanTotalResult = await barRateModel.aggregate([
//       // Match documents with the specified propertyId
//       {
//         $match: { propertyId: propertyId }
//       },
//       // Project to extract the ratePlanTotal and roomTypeId fields
//       {
//         $project: {
//           _id: 0, // Exclude the _id field from the result
//           ratePlanTotal: {
//             $arrayElemAt: ['$barRates.ratePlanTotal.ratePlanTotal', 0]
//           },
//           roomTypeId: {
//             $arrayElemAt: ['$roomType.roomTypeId', 0]
//           },
//           barRatePlanId: 1 // Include the barRatePlanId field
//         }
//       }
//     ]);

//     if (ratePlanTotalResult && ratePlanTotalResult.length > 0) {
//       // Find all the unique roomTypeIds in the result
//       const roomTypeIds = ratePlanTotalResult.map((result) => result.roomTypeId);

//       // Find all rate documents that match propertyId and any of the roomTypeIds
//       const rateDocuments = await rateModel.find({
//         propertyId,
//         roomTypeId: { $in: roomTypeIds }
//       });

//       const response = ratePlanTotalResult.map((result) => {
//         const roomTypeId = result.roomTypeId;
//         const rateDocument = rateDocuments.find((doc) => doc.roomTypeId === roomTypeId);

//         if (rateDocument) {
//           const baseRateArray = rateDocument.manageRates.baseRate;
//           return {
//             ...result,
//             baseRates: baseRateArray.map((baseRateEntry) => ({
//               date: baseRateEntry.date,
//               baseRate: baseRateEntry.baseRate,
//             })),
//           };
//         } else {
//           return result;
//         }
//       });

//       return res.status(200).json({ data: response });
//     } else {
//       return res.status(404).json({ message: 'RatePlanTotal not found', statuscode: 404 });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Internal server error', statuscode: 500 });
//   }
// };

// export default checkRate;


import barRateModel from '../../models/barRatePlan.js';
import rateModel from '../../models/manageRatesAndRestrictions.js';
import restrictionModel from '../../models/manageRestrictions.js';

const checkRate = async (req, res) => {
  const { propertyId, startDate, endDate } = req.query;

  if (startDate === endDate) {
    return res.status(400).json({ message: "start date cannot be equal to end date", statuscode: 400 });
  } else if (startDate > endDate) {
    return res.status(400).json({ message: "start date cannot be greater than end date", statuscode: 400 });
  }

  // Validate the date format
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
    return res.status(400).json({ message: "Please enter the date in the correct format (yyyy-mm-dd)", statuscode: 400 });
  }

  try {
    const ratePlanTotalResult = await barRateModel.aggregate([
      // Match documents with the specified propertyId
      {
        $match: { propertyId: propertyId }
      },
      // Project to extract the ratePlanTotal and roomTypeId fields
      {
        $project: {
          _id: 0,
          ratePlanTotal: {
            $arrayElemAt: ['$barRates.ratePlanTotal.ratePlanTotal', 0]
          },
          roomTypeId: {
            $arrayElemAt: ['$roomType.roomTypeId', 0]
          },
          ratePlanName: {
            $arrayElemAt: ['$ratePlanName.ratePlanName', 0]
          },
          barRatePlanId: 1
        }
      }
    ]);

    const response = [];

    for (const result of ratePlanTotalResult) {
      const roomTypeId = result.roomTypeId;
      const barRatePlanId = result.barRatePlanId;
      //console.log(barRatePlanId)
      const restrictionDocument = await restrictionModel.findOne({
        propertyId,
        roomTypeId,
        ratePlanId:barRatePlanId
      });
     // console.log(restrictionDocument)

      if (restrictionDocument) {
        const rateDocument = await rateModel.findOne({
          propertyId,
          roomTypeId
        });

        const filteredStopSell = sortAndFilterByDate(restrictionDocument.manageRestrictions.stopSell, startDate, endDate);
        const filteredCOA = sortAndFilterByDate(restrictionDocument.manageRestrictions.COA, startDate, endDate);
        const filteredCOD = sortAndFilterByDate(restrictionDocument.manageRestrictions.COD, startDate, endDate);
        const filteredMinimumLOS = sortAndFilterByDate(restrictionDocument.manageRestrictions.minimumLOS, startDate, endDate);
        const filteredMaximumLOS = sortAndFilterByDate(restrictionDocument.manageRestrictions.maximumLOS, startDate, endDate);

            // Filter and sort the baseRate array, and replace empty array with false
            const baseRate = rateDocument ? rateDocument.manageRates.baseRate : "false";
            const filteredBaseRate = Array.isArray(baseRate)
              ? sortAndFilterByDate(baseRate, startDate, endDate)
              : baseRate;

        // Include restrictions and rates
        response.push({
          ...result,
          baseRates: filteredBaseRate,
          stopSell: filteredStopSell,
          COA: filteredCOA,
          COD: filteredCOD,
          minimumLOS: filteredMinimumLOS,
          maximumLOS: filteredMaximumLOS,
        });
      } else {
        // No matching restrictions, check for rates
        const rateDocument = await rateModel.findOne({
          propertyId,
          roomTypeId
        });

            // Filter and sort the baseRate array, and replace empty array with false
            const baseRate = rateDocument ? rateDocument.manageRates.baseRate : "false";
            const filteredBaseRate = Array.isArray(baseRate)
              ? sortAndFilterByDate(baseRate, startDate, endDate)
              : baseRate;
        // Include rates, but no restrictions
        response.push({
          ...result,
          baseRates:filteredBaseRate,
          stopSell: "false",
          COA: "false",
          COD: "false",
          minimumLOS:"false",
          maximumLOS: "false",
        });
      }
    }

    return res.status(200).json({ data: response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error', statuscode: 500 });
  }
};

// // Helper function to filter an array of objects by date
// function filterByDate(array, startDate, endDate) {
//   return array.filter(item => item.date >= startDate && item.date <= endDate);
// }

// // Helper function to filter and sort an array of objects by date
// function sortAndFilterByDate(array, startDate, endDate) {
//   const filteredArray = array.filter(item => item.date >= startDate && item.date <= endDate);
//   // Sort the filtered array by the date field in ascending order
//   return filteredArray.sort((a, b) => new Date(a.date) - new Date(b.date));
// }

// Helper function to filter and sort an array of objects by date
function sortAndFilterByDate(array, startDate, endDate) {
  if (Array.isArray(array)) {
    const filteredArray = array.filter(item => item.date >= startDate && item.date <= endDate);
    // Sort the filtered array by the date field in ascending order
    return filteredArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    return array;
  }
}

export default checkRate;
