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


// import barRateModel from '../../models/barRatePlan.js';
// import rateModel from '../../models/manageRatesAndRestrictions.js';
// import restrictionModel from '../../models/manageRestrictions.js';

// const checkRate = async (req, res) => {
//   const { propertyId, startDate, endDate } = req.query;

//   if (startDate === endDate) {
//     return res.status(400).json({ message: "start date cannot be equal to end date", statuscode: 400 });
//   } else if (startDate > endDate) {
//     return res.status(400).json({ message: "start date cannot be greater than end date", statuscode: 400 });
//   }

//   // Validate the date format
//   const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
//   if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
//     return res.status(400).json({ message: "Please enter the date in the correct format (yyyy-mm-dd)", statuscode: 400 });
//   }

//   try {
//     const ratePlanTotalResult = await barRateModel.aggregate([
//       // Match documents with the specified propertyId
//       {
//         $match: { propertyId: propertyId }
//       },
//       // Project to extract the ratePlanTotal and roomTypeId fields
//       {
//         $project: {
//           _id: 0,
//           ratePlanTotal: {
//             $arrayElemAt: ['$barRates.ratePlanTotal.ratePlanTotal', 0]
//           },
//           roomTypeId: {
//             $arrayElemAt: ['$roomType.roomTypeId', 0]
//           },
//           ratePlanName: {
//             $arrayElemAt: ['$ratePlanName.ratePlanName', 0]
//           },
//           barRatePlanId: 1
//         }
//       }
//     ]);

//     const response = [];

//     for (const result of ratePlanTotalResult) {
//       const roomTypeId = result.roomTypeId;
//       const barRatePlanId = result.barRatePlanId;
//       //console.log(barRatePlanId)
//       const restrictionDocument = await restrictionModel.findOne({
//         propertyId,
//         roomTypeId,
//         ratePlanId:barRatePlanId
//       });
//      // console.log(restrictionDocument)

//       if (restrictionDocument) {
//         const rateDocument = await rateModel.findOne({
//           propertyId,
//           roomTypeId
//         });

//         const filteredStopSell = sortAndFilterByDate(restrictionDocument.manageRestrictions.stopSell, startDate, endDate);
//         const filteredCOA = sortAndFilterByDate(restrictionDocument.manageRestrictions.COA, startDate, endDate);
//         const filteredCOD = sortAndFilterByDate(restrictionDocument.manageRestrictions.COD, startDate, endDate);
//         const filteredMinimumLOS = sortAndFilterByDate(restrictionDocument.manageRestrictions.minimumLOS, startDate, endDate);
//         const filteredMaximumLOS = sortAndFilterByDate(restrictionDocument.manageRestrictions.maximumLOS, startDate, endDate);

//             // Filter and sort the baseRate array, and replace empty array with false
//             const baseRate = rateDocument ? rateDocument.manageRates.baseRate : "false";
//             const filteredBaseRate = Array.isArray(baseRate)
//               ? sortAndFilterByDate(baseRate, startDate, endDate)
//               : baseRate;

//         // Include restrictions and rates
//         response.push({
//           ...result,
//           baseRates: filteredBaseRate,
//           stopSell: filteredStopSell,
//           COA: filteredCOA,
//           COD: filteredCOD,
//           minimumLOS: filteredMinimumLOS,
//           maximumLOS: filteredMaximumLOS,
//         });
//       } else {
//         // No matching restrictions, check for rates
//         const rateDocument = await rateModel.findOne({
//           propertyId,
//           roomTypeId
//         });

//             // Filter and sort the baseRate array, and replace empty array with false
//             const baseRate = rateDocument ? rateDocument.manageRates.baseRate : "false";
//             const filteredBaseRate = Array.isArray(baseRate)
//               ? sortAndFilterByDate(baseRate, startDate, endDate)
//               : baseRate;
//         // Include rates, but no restrictions
//         response.push({
//           ...result,
//           baseRates:filteredBaseRate,
//           stopSell: "false",
//           COA: "false",
//           COD: "false",
//           minimumLOS:"false",
//           maximumLOS: "false",
//         });
//       }
//     }

//     return res.status(200).json({ data: response });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Internal server error', statuscode: 500 });
//   }
// };

// // // Helper function to filter an array of objects by date
// // function filterByDate(array, startDate, endDate) {
// //   return array.filter(item => item.date >= startDate && item.date <= endDate);
// // }

// // // Helper function to filter and sort an array of objects by date
// // function sortAndFilterByDate(array, startDate, endDate) {
// //   const filteredArray = array.filter(item => item.date >= startDate && item.date <= endDate);
// //   // Sort the filtered array by the date field in ascending order
// //   return filteredArray.sort((a, b) => new Date(a.date) - new Date(b.date));
// // }

// // Helper function to filter and sort an array of objects by date
// function sortAndFilterByDate(array, startDate, endDate) {
//   if (Array.isArray(array)) {
//     const filteredArray = array.filter(item => item.date >= startDate && item.date <= endDate);
//     // Sort the filtered array by the date field in ascending order
//     return filteredArray.sort((a, b) => new Date(a.date) - new Date(b.date));
//   } else {
//     return array;
//   }
// }

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
        ratePlanId: barRatePlanId
      });
     // console.log(restrictionDocument)

      if (restrictionDocument) {
        const rateDocument = await rateModel.findOne({
          propertyId,
          roomTypeId,
          ratePlanId: barRatePlanId
        });
 // Filter and sort the baseRate array, and replace empty array with ratePlanTotal
 //const filteredBaseRate = rateDocument ? rateDocument.manageRates.baseRate : "false";

        const filteredStopSell = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.stopSell, startDate, endDate);
        const filteredCOA = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.COA, startDate, endDate);
        const filteredCOD = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.COD, startDate, endDate);
        const filteredMinimumLOS = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.minimumLOS, startDate, endDate);
        const filteredMaximumLOS = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.maximumLOS, startDate, endDate);

        // Include restrictions and rates
        const baseRates = [];
        //stopSell
        filteredStopSell.forEach(item => {
          const baseRateEntry = {
            baseRate: result.ratePlanTotal,
            stopSell: item.stopSell,
            date: item.date
          };
          baseRates.push(baseRateEntry);
        });

        //COA
        filteredCOA.forEach(item => {
          const existingBaseRate = baseRates.find(entry => entry.date === item.date);
          if (existingBaseRate) {
            existingBaseRate.COA = item.COA;
          } else {
            const baseRateEntry = {
              baseRate: result.ratePlanTotal,
              COA: item.COA,
              date: item.date
            };
            baseRates.push(baseRateEntry);
          }
        });

        //COD
        filteredCOD.forEach(item => {
          const existingBaseRate = baseRates.find(entry => entry.date === item.date);
          if (existingBaseRate) {
            existingBaseRate.COD = item.COD;
          } else {
            const baseRateEntry = {
              baseRate: result.ratePlanTotal,
              COD: item.COD,
              date: item.date
            };
            baseRates.push(baseRateEntry);
        }});

        //minimumLOS
        filteredMinimumLOS.forEach(item => {
          const existingBaseRate = baseRates.find(entry => entry.date === item.date);
          if (existingBaseRate) {
            existingBaseRate.minimumLOS = item.minimumLOS;
          } else {
            const baseRateEntry = {
              baseRate: result.ratePlanTotal,
              minimumLOS: item.minimumLOS,
              date: item.date
            };
            baseRates.push(baseRateEntry);
        }});

           //maximumLOS
           filteredMaximumLOS.forEach(item => {
            const existingBaseRate = baseRates.find(entry => entry.date === item.date);
            if (existingBaseRate) {
              existingBaseRate.maximumLOS = item.maximumLOS;
            } else {
              const baseRateEntry = {
                baseRate: result.ratePlanTotal,
                maximumLOS: item.maximumLOS,
                date: item.date
              };
              baseRates.push(baseRateEntry);
          }});

          

          // Filter and sort the baseRate array, and replace empty array with false
            const baseRate = rateDocument ? rateDocument.manageRates.baseRate : "false";
            console.log(baseRate)
            const filteredBaseRate = Array.isArray(baseRate)
              ? sortAndFilterByDate(baseRate, startDate, endDate)
              : baseRate;

              

              filteredBaseRate.forEach(item => {
                const existingBaseRate = baseRates.find(entry => entry.date === item.date);
                if (existingBaseRate) {
                  existingBaseRate.baseRate = item.baseRate;
                } else {
                  const baseRateEntry = {
                    baseRate: result.ratePlanTotal,
                    maximumLOS: item.maximumLOS,
                    date: item.date
                  };
                  baseRates.push(baseRateEntry);
              }});
              
       // Include restrictions and rates  

        response.push({
          ...result,
          baseRates,
          // filteredBaseRate: Array.isArray(rateDocument.manageRates.baseRate)
          // ? sortAndFilterByDate(rateDocument.manageRates.baseRate, startDate, endDate)
          // : "false",
        });
      } else {
        // No matching restrictions, check for rates
        const rateDocument = await rateModel.findOne({
          propertyId,
          roomTypeId
        });

        // Include rates, but no restrictions
        response.push({
          ...result,
          baseRates: fillMissingDatesAndSort(
            rateDocument ? rateDocument.manageRates.baseRate : "false",
            startDate,
            endDate,
            result.ratePlanTotal // Pass ratePlanTotal from result
          ),
          stopSell: "false",
          COA: "false",
          COD: "false",
          minimumLOS: "false",
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

// Helper function to fill missing dates in an array and sort it
function fillMissingDatesAndSort(array, startDate, endDate, ratePlanTotal, stopSell, COA, COD,minimumLOS,maximumLOS) {
  if (!Array.isArray(array)) {
    return "false";
  }

  const dateSet = new Set(array.map(item => item.date));
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().slice(0, 10);
    if (!dateSet.has(formattedDate)) {
      const matchingStopSell = stopSell ? stopSell.find(item => item.date === formattedDate) : undefined;
      const matchingCOA = COA ? COA.find(item => item.date === formattedDate) : undefined;
      const matchingCOD = COD ? COD.find(item => item.date === formattedDate) : undefined;
      const matchingMinimumLOS = minimumLOS ? minimumLOS.find(item => item.date === formattedDate) : undefined;
      const matchingMaximumLOS = maximumLOS ? maximumLOS.find(item => item.date === formattedDate) : undefined;
      if (matchingStopSell && matchingCOA && matchingCOD&&matchingMinimumLOS&&matchingMaximumLOS) {
        array.push({
          baseRate: ratePlanTotal,
          stopSell: matchingStopSell.stopSell,
          COA: matchingCOA.COA,
          COD: matchingCOD.COD,
          minimumLOS:matchingMinimumLOS.minimumLOS,
          maximumLOS:matchingMaximumLOS.maximumLOS,
          date: formattedDate,
        });
      } else {
        array.push({
          baseRate: ratePlanTotal,
          date: formattedDate,
        });
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return array.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default checkRate;
