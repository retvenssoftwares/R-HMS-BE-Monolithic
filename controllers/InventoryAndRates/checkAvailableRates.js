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
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";


const checkRate = async (req, res) => {
  const { userId,propertyId, startDate, endDate } = req.query;
  const authCodeValue = req.headers['authcode'];

  const findUser = await verifiedUser.findOne({ userId });
  if (!findUser || !userId) {
      return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 });
  }
 const result = await findUserByUserIdAndToken(userId, authCodeValue);

 if(result.success){
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
          extraAdultRate: {
            $arrayElemAt: ['$barRates.extraAdultRate.extraAdultRate', 0]
          },
          extraChildRate: {
            $arrayElemAt: ['$barRates.extraChildRate.extraChildRate', 0]
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
        // const filteredCOA = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.COA, startDate, endDate);
        // const filteredCOD = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.COD, startDate, endDate);
        const filteredMinimumLOS = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.minimumLOS, startDate, endDate);
        const filteredMaximumLOS = fillMissingDatesAndSort(restrictionDocument.manageRestrictions.maximumLOS, startDate, endDate);

        // Include restrictions and rates
        const baseRates = [];
        //stopSell
        filteredStopSell.forEach(item => {
          const baseRateEntry = {
            baseRate: result.ratePlanTotal,
            extraAdultRate:result.extraAdultRate,
            extraChildRate:result.extraChildRate,
            stopSell: item.stopSell,
            date: item.date
          };
          baseRates.push(baseRateEntry);
        });

        // //COA
        // filteredCOA.forEach(item => {
        //   const existingBaseRate = baseRates.find(entry => entry.date === item.date);
        //   if (existingBaseRate) {
        //     existingBaseRate.COA = item.COA;
        //   } else {
        //     const baseRateEntry = {
        //       //baseRate: result.ratePlanTotal,
        //       COA: item.COA,
        //       date: item.date
        //     };
        //     baseRates.push(baseRateEntry);
        //   }
        // });

        // //COD
        // filteredCOD.forEach(item => {
        //   const existingBaseRate = baseRates.find(entry => entry.date === item.date);
        //   if (existingBaseRate) {
        //     existingBaseRate.COD = item.COD;
        //   } else {
        //     const baseRateEntry = {
        //      // baseRate: result.ratePlanTotal,
        //       COD: item.COD,
        //       date: item.date
        //     };
        //     baseRates.push(baseRateEntry);
        // }});

        //minimumLOS
        filteredMinimumLOS.forEach(item => {
          const existingBaseRate = baseRates.find(entry => entry.date === item.date);
          if (existingBaseRate) {
            existingBaseRate.minimumLOS = item.minimumLOS;
          } else {
            const baseRateEntry = {
              //baseRate: result.ratePlanTotal,
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
               // baseRate: result.ratePlanTotal,
                maximumLOS: item.maximumLOS,
                date: item.date
              };
              baseRates.push(baseRateEntry);
          }});

          

          // Filter and sort the baseRate array, and replace empty array with false
            const baseRate = rateDocument ? rateDocument.manageRates.baseRate : "false";
            // console.log(baseRate)
            const filteredBaseRate = Array.isArray(baseRate)
              ? sortAndFilterByDate(baseRate, startDate, endDate)
              : baseRate;

               ///filteredBaseRate
               filteredBaseRate.forEach(item => {
                const existingBaseRate = baseRates.find(entry => entry.date === item.date);
                if (existingBaseRate) {
                  existingBaseRate.baseRate = item.baseRate;
                } else {
                  const baseRateEntry = {
                    baseRate: result.ratePlanTotal,
                    date: item.date
                  };
                  baseRates.push(baseRateEntry);
              }});

              
          // Filter and sort the extraAdultRate array, and replace empty array with false
            const extraAdultRate = rateDocument ? rateDocument.manageRates.extraAdultRate : "false";
          //  console.log(extraAdultRate)
            const filteredextraAdultRate = Array.isArray(extraAdultRate)
              ? sortAndFilterByDate(extraAdultRate, startDate, endDate)
              : extraAdultRate;

            ///filteredExtraAdultRate
            filteredextraAdultRate.forEach(item => {
              const existingExtraAdultRate = baseRates.find(entry => entry.date === item.date);
              if (existingExtraAdultRate) {
                existingExtraAdultRate.extraAdultRate = item.extraAdultRate;
              } else {
                const baseRateEntry = {
                  extraAdultRate: result.extraAdultRate,
                  date: item.date
                };
                baseRates.push(baseRateEntry);
            }});

             // Filter and sort the extraChildtRate array, and replace empty array with false
             const extraChildRate = rateDocument ? rateDocument.manageRates.extraChildRate : "false";
             //  console.log(extraAdultRate)
               const filteredextraChildRate = Array.isArray(extraChildRate)
                 ? sortAndFilterByDate(extraChildRate, startDate, endDate)
                 : extraChildRate;
   
               ///filteredExtraChildRate
               filteredextraChildRate.forEach(item => {
                 const existingExtraChildRate = baseRates.find(entry => entry.date === item.date);
                 if (existingExtraChildRate) {
                  existingExtraChildRate.extraChildRate = item.extraChildRate;
                 } else {
                   const baseRateEntry = {
                    extraChildRate: result.extraChildRate,
                     date: item.date
                   };
                   baseRates.push(baseRateEntry);
               }});

              
       // Include restrictions and rates  
        response.push({
          ...result,
          baseRates,
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
          extraAdultRate: fillMissingDatesAndSort(
            rateDocument ? rateDocument.manageRates.extraAdultRate : "false",
            startDate,
            endDate,
            result.extraAdultRate // Pass extraAdultRate from result
          ),
          stopSell: "false",
          // COA: "false",
          // COD: "false",
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
} else {
  return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
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
function fillMissingDatesAndSort(array, startDate, endDate, ratePlanTotal,extraAdultRate, stopSell, COA, COD, minimumLOS, maximumLOS) {
  if (!Array.isArray(array)) {
    return "false";
  }

  const dateSet = new Set(array.map(item => item.date));
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().slice(0, 10);
    
    if (formattedDate <= endDate) {
      if (!dateSet.has(formattedDate)) {
        const matchingStopSell = stopSell ? stopSell.find(item => item.date === formattedDate) : undefined;
        // const matchingCOA = COA ? COA.find(item => item.date === formattedDate) : undefined;
        // const matchingCOD = COD ? COD.find(item => item.date === formattedDate) : undefined;
        const matchingMinimumLOS = minimumLOS ? minimumLOS.find(item => item.date === formattedDate) : undefined;
        const matchingMaximumLOS = maximumLOS ? maximumLOS.find(item => item.date === formattedDate) : undefined;

        if (matchingStopSell && matchingCOA && matchingCOD && matchingMinimumLOS && matchingMaximumLOS) {
          array.push({
            baseRate: ratePlanTotal,
            extraAdultRate:extraAdultRate,
            stopSell: matchingStopSell.stopSell,
            // COA: matchingCOA.COA,
            // COD: matchingCOD.COD,
            minimumLOS: matchingMinimumLOS.minimumLOS,
            maximumLOS: matchingMaximumLOS.maximumLOS,
            date: formattedDate,
          });
        } else {
          array.push({
            baseRate: ratePlanTotal,
            extraAdultRate:extraAdultRate,
            date: formattedDate,
          });
        }
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return array
    .filter(item => item.date <= endDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}


export default checkRate;
