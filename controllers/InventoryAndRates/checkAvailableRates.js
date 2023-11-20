// import barRateModel from "../../models/barRatePlan.js";
// import rateModel from "../../models/manageRatesAndRestrictions.js";
// import otaModel from "../../models/manageOTARates.js";
// import otaAdmin from "../../models/superAdmin/otaModel.js";
// import restrictionModel from "../../models/manageRestrictions.js";
// import { findUserByUserIdAndToken } from "../../helpers/helper.js";
// import verifiedUser from "../../models/verifiedUsers.js";

// const checkRate = async (req, res) => {
//   const { userId, roomTypeId, startDate, endDate } = req.query;
//   const authCodeValue = req.headers["authcode"];

//   const findUser = await verifiedUser.findOne({ userId });
//   if (!findUser || !userId) {
//     return res
//       .status(400)
//       .json({ message: "User not found or invalid userId", statuscode: 400 });
//   }
//   const result = await findUserByUserIdAndToken(userId, authCodeValue);

//   if (result.success) {
//     if (startDate === endDate) {
//       return res.status(400).json({
//         message: "start date cannot be equal to end date",
//         statuscode: 400,
//       });
//     } else if (startDate > endDate) {
//       return res.status(400).json({
//         message: "start date cannot be greater than end date",
//         statuscode: 400,
//       });
//     }

//     // Validate the date format
//     const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
//       return res.status(400).json({
//         message: "Please enter the date in the correct format (yyyy-mm-dd)",
//         statuscode: 400,
//       });
//     }

//     try {
//       const ratePlanTotalResult = await barRateModel.aggregate([
//         // Match documents with the specified propertyId
//         {
//           $match: { "roomType.roomTypeId": roomTypeId },
//         },
//         // Project to extract the ratePlanTotal and roomTypeId fields
//         {
//           $project: {
//             _id: 0,
//             ratePlanTotal: {
//               $arrayElemAt: ["$barRates.ratePlanTotal.ratePlanTotal", 0],
//             },
//             extraAdultRate: {
//               $arrayElemAt: ["$barRates.extraAdultRate.extraAdultRate", 0],
//             },
//             extraChildRate: {
//               $arrayElemAt: ["$barRates.extraChildRate.extraChildRate", 0],
//             },
//             roomTypeId: {
//               $arrayElemAt: ["$roomType.roomTypeId", 0],
//             },
//             ratePlanName: {
//               $arrayElemAt: ["$ratePlanName.ratePlanName", 0],
//             },
//             barRatePlanId: 1,
//           },
//         },
//       ]);

//       //const response = [];
//       const OTA = [];
//       const response = await Promise.all(ratePlanTotalResult.map(async (result) => {
//         const { roomTypeId, barRatePlanId } = result;
//         //console.log(barRatePlanId)
//         // const restrictionDocument = await restrictionModel.findOne({
//         //  // propertyId,
//         //   roomTypeId,
//         //   ratePlanId: barRatePlanId,
//         // });
//         // //console.log(restrictionDocument)

//         // const otaDocuments = await otaModel.find({
//         //  // propertyId,
//         //   roomTypeId,
//         //   ratePlanId: barRatePlanId,
//         // },
//         // { otaId: 1, source: 1,manageOTARates: 1 } // Include otaId and source in the projection
//         // )

//         // Fetch restriction document
//         const [restrictionDocument, otaDocuments] = await Promise.all([
//           restrictionModel.findOne({ roomTypeId, ratePlanId: barRatePlanId }),
//           otaModel.find({ roomTypeId, ratePlanId: barRatePlanId }, { otaId: 1, source: 1, manageOTARates: 1 }),
//         ]);
//         // const otaIds = otaDocuments.map((otaDoc) => ({
//         //   otaId: otaDoc.otaId,
//         //   source: otaDoc.source,
//         //   OTARates: otaDoc.manageOTARates.baseRate.filter((rate) => (
//         //     rate.date >= startDate && rate.date <= endDate
//         //   )),
//         // }));

//         // const otaIds = otaDocuments.map((otaDoc) => {
//         //   const OTARates = otaDoc.manageOTARates.baseRate
//         //     .filter((rate) => rate.date >= startDate && rate.date <= endDate)
//         //     .map((rate) => ({
//         //       baseRate: rate.baseRate,
//         //       extraAdultRate: otaDoc.manageOTARates.extraAdultRate
//         //         .find((extra) => extra.date === rate.date)?.extraAdultRate || result.extraAdultRate,
//         //       extraChildRate: otaDoc.manageOTARates.extraChildRate
//         //         .find((extra) => extra.date === rate.date)?.extraChildRate || result.extraChildRate,
//         //       date: rate.date,
//         //       _id: rate._id,
//         //     }));

//         //   return {
//         //     otaId: otaDoc.otaId,
//         //     source: otaDoc.source,
//         //     OTARates,
//         //   };
//         // });

//         //ota rates
//         const otaIds = await Promise.all(
//           otaDocuments.map(async (otaDoc) => {
//             const OTARates = [];
//             const startDateObj = new Date(startDate);
//             const endDateObj = new Date(endDate);

//             while (startDateObj <= endDateObj) {
//               const formattedDate = startDateObj.toISOString().slice(0, 10);

//               const rate = otaDoc.manageOTARates.baseRate.find(
//                 (rate) => rate.date === formattedDate
//               );

//               const extraAdultRate =
//                 otaDoc.manageOTARates.extraAdultRate.find(
//                   (extra) => extra.date === formattedDate
//                 )?.extraAdultRate || result.extraAdultRate;

//               const extraChildRate =
//                 otaDoc.manageOTARates.extraChildRate.find(
//                   (extra) => extra.date === formattedDate
//                 )?.extraChildRate || result.extraChildRate;

//               OTARates.push({
//                 baseRate: rate ? rate.baseRate : result.ratePlanTotal,
//                 extraAdultRate,
//                 extraChildRate,
//                 date: formattedDate,
//                 //_id: rate ? rate._id : "false", // Assuming a default value for _id when date is missing
//               });

//               startDateObj.setDate(startDateObj.getDate() + 1);
//             }

//             const otaData = await otaAdmin.findOne({
//               "otaId.otaId": otaDoc.otaId,
//             });
//             const data = {
//               // otaLogo: otaData.otaLogo[0].otaLogo,
//               // otaName: otaData.otaName[0].otaName
//               otaLogo: otaData?.otaLogo?.[0]?.otaLogo ?? "DefaultLogo",
//               otaName: otaData?.otaName?.[0]?.otaName ?? "DefaultName",
//             };

//             return {
//               otaId: otaDoc.otaId,
//               otalogo: data.otaLogo,
//               otaName: data.otaName,
//               //source: otaDoc.source,
//               OTARates,
//             };
//           })
//         );

//         //    console.log(otaIds);

//         if (restrictionDocument) {
//           const rateDocument = await rateModel.findOne({
//             // propertyId,
//             roomTypeId,
//             ratePlanId: barRatePlanId,
//           });

//           const filteredStopSell = fillMissingDatesAndSort(
//             restrictionDocument.manageRestrictions.stopSell,
//             startDate,
//             endDate
//           );
//           const filteredMinimumLOS = fillMissingDatesAndSort(
//             restrictionDocument.manageRestrictions.minimumLOS,
//             startDate,
//             endDate
//           );
//           const filteredMaximumLOS = fillMissingDatesAndSort(
//             restrictionDocument.manageRestrictions.maximumLOS,
//             startDate,
//             endDate
//           );

//           const filteredCOA = fillMissingDatesAndSort(
//             restrictionDocument.manageRestrictions.COA,
//             startDate,
//             endDate
//           );
//           const filteredCOD = fillMissingDatesAndSort(
//             restrictionDocument.manageRestrictions.COD,
//             startDate,
//             endDate
//           );

//           // Include restrictions and rates
//           const baseRates = [];
//           //stopSell
//           filteredStopSell.forEach((item) => {
//             const baseRateEntry = {
//               baseRate: result.ratePlanTotal,
//               extraAdultRate: result.extraAdultRate,
//               extraChildRate: result.extraChildRate,
//               stopSell: item.stopSell,
//               date: item.date,
//             };
//             baseRates.push(baseRateEntry);
//           });

//           //minimumLOS
//           filteredMinimumLOS.forEach((item) => {
//             const existingBaseRate = baseRates.find(
//               (entry) => entry.date === item.date
//             );
//             if (existingBaseRate) {
//               existingBaseRate.minimumLOS = item.minimumLOS;
//             } else {
//               const baseRateEntry = {
//                 //baseRate: result.ratePlanTotal,
//                 minimumLOS: item.minimumLOS,
//                 date: item.date,
//               };
//               baseRates.push(baseRateEntry);
//             }
//           });

//           //maximumLOS
//           filteredMaximumLOS.forEach((item) => {
//             const existingBaseRate = baseRates.find(
//               (entry) => entry.date === item.date
//             );
//             if (existingBaseRate) {
//               existingBaseRate.maximumLOS = item.maximumLOS;
//             } else {
//               const baseRateEntry = {
//                 // baseRate: result.ratePlanTotal,
//                 maximumLOS: item.maximumLOS,
//                 date: item.date,
//               };
//               baseRates.push(baseRateEntry);
//             }
//           });

//           //COA
//           filteredCOA.forEach((item) => {
//             const existingBaseRate = baseRates.find(
//               (entry) => entry.date === item.date
//             );
//             if (existingBaseRate) {
//               existingBaseRate.COA = item.COA;
//             } else {
//               const baseRateEntry = {
//                 // baseRate: result.ratePlanTotal,
//                 COA: item.COA,
//                 date: item.date,
//               };
//               baseRates.push(baseRateEntry);
//             }
//           });

//           //COD
//           filteredCOD.forEach((item) => {
//             const existingBaseRate = baseRates.find(
//               (entry) => entry.date === item.date
//             );
//             if (existingBaseRate) {
//               existingBaseRate.COD = item.COD;
//             } else {
//               const baseRateEntry = {
//                 // baseRate: result.ratePlanTotal,
//                 COD: item.COD,
//                 date: item.date,
//               };
//               baseRates.push(baseRateEntry);
//             }
//           });

//           // Filter and sort the baseRate array, and replace empty array with false
//           const baseRate = rateDocument
//             ? rateDocument.manageRates.baseRate
//             : "false";
//           // console.log(baseRate)
//           const filteredBaseRate = Array.isArray(baseRate)
//             ? sortAndFilterByDate(baseRate, startDate, endDate)
//             : [baseRate];

//           ///filteredBaseRate
//           filteredBaseRate.forEach((item) => {
//             const existingBaseRate = baseRates.find(
//               (entry) => entry.date === item.date
//             );
//             if (existingBaseRate) {
//               existingBaseRate.baseRate = item.baseRate;
//             } else {
//               const baseRateEntry = {
//                 baseRate: result.ratePlanTotal,
//                 date: item.date,
//               };
//               baseRates.push(baseRateEntry);
//             }
//           });

//           // Filter and sort the extraAdultRate array, and replace empty array with false
//           const extraAdultRate = rateDocument
//             ? rateDocument.manageRates.extraAdultRate
//             : "false";
//           //  console.log(extraAdultRate)
//           const filteredextraAdultRate = Array.isArray(extraAdultRate)
//             ? sortAndFilterByDate(extraAdultRate, startDate, endDate)
//             : [extraAdultRate];

//           ///filteredExtraAdultRate
//           filteredextraAdultRate.forEach((item) => {
//             const existingExtraAdultRate = baseRates.find(
//               (entry) => entry.date === item.date
//             );
//             if (existingExtraAdultRate) {
//               existingExtraAdultRate.extraAdultRate = item.extraAdultRate;
//             } else {
//               const baseRateEntry = {
//                 extraAdultRate: result.extraAdultRate,
//                 date: item.date,
//               };
//               baseRates.push(baseRateEntry);
//             }
//           });

//           // Filter and sort the extraChildtRate array, and replace empty array with false
//           const extraChildRate = rateDocument
//             ? rateDocument.manageRates.extraChildRate
//             : "false";
//           //  console.log(extraAdultRate)
//           const filteredextraChildRate = Array.isArray(extraChildRate)
//             ? sortAndFilterByDate(extraChildRate, startDate, endDate)
//             : [extraChildRate];

//           ///filteredExtraChildRate
//           filteredextraChildRate.forEach((item) => {
//             const existingExtraChildRate = baseRates.find(
//               (entry) => entry.date === item.date
//             );
//             if (existingExtraChildRate) {
//               existingExtraChildRate.extraChildRate = item.extraChildRate;
//             } else {
//               const baseRateEntry = {
//                 extraChildRate: result.extraChildRate,
//                 date: item.date,
//               };
//               baseRates.push(baseRateEntry);
//             }
//           });

//           // Include restrictions and rates
//           return {
//             ...result,
//             baseRates,
//             OTA:
//               otaIds.length > 0
//                 ? otaIds
//                 : [
//                     {
//                       otaId: "false",
//                       otaName: "false",
//                       otaLogo: "false",
//                       ratePlanId: "false",
//                     },
//                   ],
//           };
//         } else if (!restrictionDocument) {
//           const rateDocument = await rateModel.findOne({
//             // propertyId,
//             roomTypeId,
//             ratePlanId: barRatePlanId,
//           });

//           // Include rates, but no restrictions
//           const baseRates = [];
//           const currentDate = new Date(startDate);
//           while (currentDate <= new Date(endDate)) {
//             const formattedDate = currentDate.toISOString().slice(0, 10);
//             const baseRateEntry = {
//               date: formattedDate,
//               stopSell: "false",
//               COA: "false",
//               COD: "false",
//               minimumLOS: 0,
//               maximumLOS: 0,
//             };

//             if (
//               rateDocument &&
//               Array.isArray(rateDocument.manageRates.baseRate)
//             ) {
//               const matchingRate = rateDocument.manageRates.baseRate.find(
//                 (item) => item.date === formattedDate
//               );

//               if (matchingRate) {
//                 baseRateEntry.baseRate = matchingRate.baseRate;
//               } else {
//                 baseRateEntry.baseRate = result.ratePlanTotal;
//               }
//             } else {
//               baseRateEntry.baseRate = result.ratePlanTotal;
//             }

//             if (
//               rateDocument &&
//               Array.isArray(rateDocument.manageRates.extraAdultRate)
//             ) {
//               const matchingExtraAdultRate =
//                 rateDocument.manageRates.extraAdultRate.find(
//                   (item) => item.date === formattedDate
//                 );

//               if (matchingExtraAdultRate) {
//                 baseRateEntry.extraAdultRate =
//                   matchingExtraAdultRate.extraAdultRate;
//               } else {
//                 baseRateEntry.extraAdultRate = result.extraAdultRate;
//               }
//             } else {
//               baseRateEntry.extraAdultRate = result.extraAdultRate;
//             }

//             if (
//               rateDocument &&
//               Array.isArray(rateDocument.manageRates.extraChildRate)
//             ) {
//               const matchingExtraChildRate =
//                 rateDocument.manageRates.extraChildRate.find(
//                   (item) => item.date === formattedDate
//                 );

//               if (matchingExtraChildRate) {
//                 baseRateEntry.extraChildRate =
//                   matchingExtraChildRate.extraChildRate;
//               } else {
//                 baseRateEntry.extraChildRate = result.extraChildRate;
//               }
//             } else {
//               baseRateEntry.extraChildRate = result.extraChildRate;
//             }

//             baseRates.push(baseRateEntry);
//             currentDate.setDate(currentDate.getDate() + 1);
//           }

//           return {
//             ...result,
//             baseRates,
//             OTA:
//               otaIds.length > 0
//                 ? otaIds
//                 : [
//                     {
//                       otaId: "false",
//                       otaName: "false",
//                       otaLogo: "false",
//                       ratePlanId: "false",
//                     },
//                   ],
//           };
//         }
//       }));

//       if (req.query.status) {
//         return response;
//       } else {
//         return res.status(200).json({ data: response, statuscode: 200 });
//       }
//     } catch (err) {
//       console.error(err);
//       return res
//         .status(500)
//         .json({ message: "Internal server error", statuscode: 500 });
//     }
//   } else {
//     return res
//       .status(result.statuscode)
//       .json({ message: result.message, statuscode: result.statuscode });
//   }
// };

// // Helper function to filter and sort an array of objects by date
// function sortAndFilterByDate(array, startDate, endDate) {
//   if (Array.isArray(array)) {
//     const filteredArray = array.filter(
//       (item) => item.date >= startDate && item.date <= endDate
//     );
//     // Sort the filtered array by the date field in ascending order
//     return filteredArray.sort((a, b) => new Date(a.date) - new Date(b.date));
//   } else {
//     return array;
//   }
// }

// // Helper function to fill missing dates in an array and sort it
// function fillMissingDatesAndSort(
//   array,
//   startDate,
//   endDate,
//   ratePlanTotal,
//   extraAdultRate,
//   stopSell,
//   COA,
//   COD,
//   minimumLOS,
//   maximumLOS
// ) {
//   if (!Array.isArray(array)) {
//     return "false";
//   }

//   const dateSet = new Set(array.map((item) => item.date));
//   const currentDate = new Date(startDate);

//   while (currentDate <= new Date(endDate)) {
//     const formattedDate = currentDate.toISOString().slice(0, 10);

//     if (formattedDate <= endDate) {
//       if (!dateSet.has(formattedDate)) {
//         if (formattedDate >= startDate) {
//           // Check if the date is within the specified range
//           const matchingStopSell = stopSell
//             ? stopSell.find((item) => item.date === formattedDate)
//             : undefined;
//           const matchingMinimumLOS = minimumLOS
//             ? minimumLOS.find((item) => item.date === formattedDate)
//             : undefined;
//           const matchingMaximumLOS = maximumLOS
//             ? maximumLOS.find((item) => item.date === formattedDate)
//             : undefined;
//           const matchingCOA = COA
//             ? COA.find((item) => item.date === formattedDate)
//             : undefined;
//           const matchingCOD = COD
//             ? COD.find((item) => item.date === formattedDate)
//             : undefined;

//           if (
//             matchingStopSell ||
//             matchingMinimumLOS ||
//             matchingMaximumLOS ||
//             matchingCOA ||
//             matchingCOD
//           ) {
//             array.push({
//               baseRate: ratePlanTotal,
//               extraAdultRate: extraAdultRate,
//               stopSell: matchingStopSell ? matchingStopSell.stopSell : "false",
//               minimumLOS: matchingMinimumLOS
//                 ? matchingMinimumLOS.minimumLOS
//                 : "false",
//               maximumLOS: matchingMaximumLOS
//                 ? matchingMaximumLOS.maximumLOS
//                 : "false",
//               COA: matchingCOA ? matchingCOA.COA : "false",
//               COD: matchingCOD ? matchingCOD.COD : "false",
//               date: formattedDate,
//             });
//           } else {
//             array.push({
//               baseRate: ratePlanTotal,
//               extraAdultRate: extraAdultRate,
//               date: formattedDate,
//             });
//           }
//         }
//       }
//     }
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return array
//     .filter((item) => item.date >= startDate && item.date <= endDate) // Filter for dates within the range
//     .sort((a, b) => new Date(a.date) - new Date(b.date));
// }

// export default checkRate;




import barRateModel from "../../models/barRatePlan.js";
import rateModel from "../../models/manageRatesAndRestrictions.js";
import otaModel from "../../models/manageOTARates.js";
import otaAdmin from "../../models/superAdmin/otaModel.js";
import restrictionModel from "../../models/manageRestrictions.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";

const checkRate = async (req, res) => {
  const { userId, roomTypeId, startDate, endDate } = req.query;
  const authCodeValue = req.headers["authcode"];

  const findUser = await verifiedUser.findOne({ userId });
  if (!findUser || !userId) {
    return res
      .status(400)
      .json({ message: "User not found or invalid userId", statuscode: 400 });
  }
  const result = await findUserByUserIdAndToken(userId, authCodeValue);

  if (result.success) {
    // if (startDate === endDate) {
    //   return res.status(400).json({
    //     message: "start date cannot be equal to end date",
    //     statuscode: 400,
    //   });
    // } 
     if (startDate > endDate) {
      return res.status(400).json({
        message: "start date cannot be greater than end date",
        statuscode: 400,
      });
    }

    // Validate the date format
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
      return res.status(400).json({
        message: "Please enter the date in the correct format (yyyy-mm-dd)",
        statuscode: 400,
      });
    }

    try {
      const ratePlanTotalResult = await barRateModel.aggregate([
        // Match documents with the specified propertyId
        {
          $match: { "roomType.roomTypeId": roomTypeId },
        },
        // Project to extract the ratePlanTotal and roomTypeId fields
        {
          $project: {
            _id: 0,
            ratePlanTotal: {
              $arrayElemAt: ["$barRates.ratePlanTotal.ratePlanTotal", 0],
            },
            extraAdultRate: {
              $arrayElemAt: ["$barRates.extraAdultRate.extraAdultRate", 0],
            },
            extraChildRate: {
              $arrayElemAt: ["$barRates.extraChildRate.extraChildRate", 0],
            },
            roomTypeId: {
              $arrayElemAt: ["$roomType.roomTypeId", 0],
            },
            ratePlanName: {
              $arrayElemAt: ["$ratePlanName.ratePlanName", 0],
            },
            barRatePlanId: 1,
          },
        },
      ]);

      //const response = [];
      const OTA = [];
      const response = await Promise.all(ratePlanTotalResult.map(async (result) => {
        const { roomTypeId, barRatePlanId } = result;
        //console.log(barRatePlanId)
   

        // Fetch restriction document
        const [restrictionDocument, otaDocuments] = await Promise.all([
          restrictionModel.findOne({ roomTypeId, ratePlanId: barRatePlanId }),
          otaModel.find({ roomTypeId, ratePlanId: barRatePlanId }, { otaId: 1, source: 1, manageOTARates: 1 }),
        ]);
    

    
        //ota rates
        const otaIds = await Promise.all(
          otaDocuments.map(async (otaDoc) => {
            const OTARates = [];
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            while (startDateObj <= endDateObj) {
              const formattedDate = startDateObj.toISOString().slice(0, 10);

              const rate = otaDoc.manageOTARates.baseRate.find(
                (rate) => rate.date === formattedDate
              );

              const extraAdultRate =
                otaDoc.manageOTARates.extraAdultRate.find(
                  (extra) => extra.date === formattedDate
                )?.extraAdultRate || result.extraAdultRate;

              const extraChildRate =
                otaDoc.manageOTARates.extraChildRate.find(
                  (extra) => extra.date === formattedDate
                )?.extraChildRate || result.extraChildRate;

              OTARates.push({
                baseRate: rate ? rate.baseRate : result.ratePlanTotal,
                extraAdultRate,
                extraChildRate,
                date: formattedDate,
                //_id: rate ? rate._id : "false", // Assuming a default value for _id when date is missing
              });

              startDateObj.setDate(startDateObj.getDate() + 1);
            }

            const otaData = await otaAdmin.findOne({
              "otaId.otaId": otaDoc.otaId,
            });
            const data = {
              // otaLogo: otaData.otaLogo[0].otaLogo,
              // otaName: otaData.otaName[0].otaName
              otaLogo: otaData?.otaLogo?.[0]?.otaLogo ?? "DefaultLogo",
              otaName: otaData?.otaName?.[0]?.otaName ?? "DefaultName",
            };

            return {
              otaId: otaDoc.otaId,
              otalogo: data.otaLogo,
              otaName: data.otaName,
              //source: otaDoc.source,
              OTARates,
            };
          })
        );

        //    console.log(otaIds);

        if (restrictionDocument) {
          const rateDocument = await rateModel.findOne({ roomTypeId, ratePlanId: barRatePlanId });
    
          // Extract the filtered and sorted arrays using a helper function
          const baseRates = extractFilteredAndSortedArray(
            restrictionDocument.manageRestrictions.stopSell,
            restrictionDocument.manageRestrictions.minimumLOS,
            restrictionDocument.manageRestrictions.maximumLOS,
            restrictionDocument.manageRestrictions.COA,
            restrictionDocument.manageRestrictions.COD,
            rateDocument ? rateDocument.manageRates.baseRate : null,
            rateDocument ? rateDocument.manageRates.extraAdultRate : null,
            rateDocument ? rateDocument.manageRates.extraChildRate : null,
            startDate,
            endDate,
            result.ratePlanTotal,
            result.extraAdultRate,
            result.extraChildRate
          );
    
          return {
            ...result,
            baseRates,
            OTA: otaIds.length > 0 ? otaIds : [{
              otaId: "false",
              otaName: "false",
              otaLogo: "false",
              ratePlanId: "false",
            }],
          };
        } else {
          const rateDocument = await rateModel.findOne({ roomTypeId, ratePlanId: barRatePlanId });
    
          // Extract the baseRates array for scenarios where no restrictions are present
          const baseRates = extractBaseRatesForNoRestrictions(
            rateDocument ? rateDocument.manageRates.baseRate : null,
            rateDocument ? rateDocument.manageRates.extraAdultRate : null,
            rateDocument ? rateDocument.manageRates.extraChildRate : null,
            startDate,
            endDate,
            result.ratePlanTotal,
            result.extraAdultRate,
            result.extraChildRate
          );
    
          return {
            ...result,
            baseRates,
            OTA: otaIds.length > 0 ? otaIds : [{
              otaId: "false",
              otaName: "false",
              otaLogo: "false",
              ratePlanId: "false",
            }],
          };
        }
      }));

      if (req.query.status) {
        return response;
      } else {
        return res.status(200).json({ data: response, statuscode: 200 });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal server error", statuscode: 500 });
    }
  } else {
    return res
      .status(result.statuscode)
      .json({ message: result.message, statuscode: result.statuscode });
  }
};

// Helper function to filter and sort an array of objects by date
function sortAndFilterByDate(array, startDate, endDate) {
  if (Array.isArray(array)) {
    const filteredArray = array.filter(
      (item) => item.date >= startDate && item.date <= endDate
    );
    // Sort the filtered array by the date field in ascending order
    return filteredArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    return array;
  }
}

// Helper function to fill missing dates in an array and sort it
function fillMissingDatesAndSort(
  array,
  startDate,
  endDate,
  ratePlanTotal,
  extraAdultRate,
  stopSell,
  COA,
  COD,
  minimumLOS,
  maximumLOS
) {
  if (!Array.isArray(array)) {
    return "false";
  }

  const dateSet = new Set(array.map((item) => item.date));
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().slice(0, 10);

    if (formattedDate <= endDate) {
      if (!dateSet.has(formattedDate)) {
        if (formattedDate >= startDate) {
          // Check if the date is within the specified range
          const matchingStopSell = stopSell
            ? stopSell.find((item) => item.date === formattedDate)
            : undefined;
          const matchingMinimumLOS = minimumLOS
            ? minimumLOS.find((item) => item.date === formattedDate)
            : undefined;
          const matchingMaximumLOS = maximumLOS
            ? maximumLOS.find((item) => item.date === formattedDate)
            : undefined;
          const matchingCOA = COA
            ? COA.find((item) => item.date === formattedDate)
            : undefined;
          const matchingCOD = COD
            ? COD.find((item) => item.date === formattedDate)
            : undefined;

          if (
            matchingStopSell ||
            matchingMinimumLOS ||
            matchingMaximumLOS ||
            matchingCOA ||
            matchingCOD
          ) {
            array.push({
              baseRate: ratePlanTotal,
              extraAdultRate: extraAdultRate,
              stopSell: matchingStopSell ? matchingStopSell.stopSell : "false",
              minimumLOS: matchingMinimumLOS
                ? matchingMinimumLOS.minimumLOS
                : "false",
              maximumLOS: matchingMaximumLOS
                ? matchingMaximumLOS.maximumLOS
                : "false",
              COA: matchingCOA ? matchingCOA.COA : "false",
              COD: matchingCOD ? matchingCOD.COD : "false",
              date: formattedDate,
            });
          } else {
            array.push({
              baseRate: ratePlanTotal,
              extraAdultRate: extraAdultRate,
              date: formattedDate,
            });
          }
        }
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return array
    .filter((item) => item.date >= startDate && item.date <= endDate) // Filter for dates within the range
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}



// Helper function to extract filtered and sorted arrays when restrictions are present
function extractFilteredAndSortedArray(stopSell, minimumLOS, maximumLOS, COA, COD, baseRate, extraAdultRate, extraChildRate, startDate, endDate, ratePlanTotal, extraAdultRateVal, extraChildRateVal) {
  const filteredStopSell = fillMissingDatesAndSort(stopSell, startDate, endDate);
  const filteredMinimumLOS = fillMissingDatesAndSort(minimumLOS, startDate, endDate);
  const filteredMaximumLOS = fillMissingDatesAndSort(maximumLOS, startDate, endDate);
  const filteredCOA = fillMissingDatesAndSort(COA, startDate, endDate);
  const filteredCOD = fillMissingDatesAndSort(COD, startDate, endDate);

  const baseRates = [];

  // Iterate through the dates to construct baseRates
  const dateSet = new Set([
    ...filteredStopSell.map((item) => item.date),
    ...filteredMinimumLOS.map((item) => item.date),
    ...filteredMaximumLOS.map((item) => item.date),
    ...filteredCOA.map((item) => item.date),
    ...filteredCOD.map((item) => item.date),
  ]);

  dateSet.forEach((date) => {
    const stopSellEntry = filteredStopSell.find((item) => item.date === date);
    const minimumLOSEntry = filteredMinimumLOS.find((item) => item.date === date);
    const maximumLOSEntry = filteredMaximumLOS.find((item) => item.date === date);
    const COAEntry = filteredCOA.find((item) => item.date === date);
    const CODEntry = filteredCOD.find((item) => item.date === date);

    const baseRateEntry = {
      date,
      baseRate:  baseRate ? baseRate.find((item) => item.date === date)?.baseRate || ratePlanTotal:ratePlanTotal,
      extraAdultRate: extraAdultRate ? extraAdultRate.find((item) => item.date === date)?.extraAdultRate || extraAdultRateVal : extraAdultRateVal,
      extraChildRate: extraChildRate ? extraChildRate.find((item) => item.date === date)?.extraChildRate || extraChildRateVal : extraChildRateVal,
    };

    if (stopSellEntry) {
      baseRateEntry.stopSell = stopSellEntry.stopSell;
    }
    if (minimumLOSEntry) {
      baseRateEntry.minimumLOS = minimumLOSEntry.minimumLOS;
    }
    if (maximumLOSEntry) {
      baseRateEntry.maximumLOS = maximumLOSEntry.maximumLOS;
    }
    if (COAEntry) {
      baseRateEntry.COA = COAEntry.COA;
    }
    if (CODEntry) {
      baseRateEntry.COD = CODEntry.COD;
    }

    baseRates.push(baseRateEntry);
  });

  return baseRates;
}

// Helper function to extract baseRates when no restrictions are present
function extractBaseRatesForNoRestrictions(baseRate, extraAdultRate, extraChildRate, startDate, endDate, ratePlanTotal, extraAdultRateVal, extraChildRateVal) {
  const baseRates = [];

  const currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().slice(0, 10);

    const baseRateEntry = {
      date: formattedDate,
      baseRate: baseRate ? baseRate.find((item) => item.date === formattedDate)?.baseRate || ratePlanTotal : ratePlanTotal,
      extraAdultRate: extraAdultRate ? extraAdultRate.find((item) => item.date === formattedDate)?.extraAdultRate || extraAdultRateVal : extraAdultRateVal,
      extraChildRate: extraChildRate ? extraChildRate.find((item) => item.date === formattedDate)?.extraChildRate || extraChildRateVal : extraChildRateVal,
      stopSell: "false", // Default value for stopSell
      COA: "false", // Default value for COA
      COD: "false", // Default value for COD
      minimumLOS: 0, // Default value for minimumLOS
      maximumLOS: 0, // Default value for maximumLOS
    };

    baseRates.push(baseRateEntry);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return baseRates;
}


export default checkRate;
