import barRateModel from '../../models/barRatePlan.js';
import rateModel from '../../models/manageRatesAndRestrictions.js';

const checkRate = async (req, res) => {
  const { propertyId, checkInDate, checkOutDate } = req.query;

  try {
    const ratePlanTotalResult = await barRateModel.aggregate([
      // Match documents with the specified propertyId
      {
        $match: { propertyId: propertyId }
      },
      // Project to extract the ratePlanTotal and roomTypeId fields
      {
        $project: {
          _id: 0, // Exclude the _id field from the result
          ratePlanTotal: {
            $arrayElemAt: ['$barRates.ratePlanTotal.ratePlanTotal', 0]
          },
          roomTypeId: {
            $arrayElemAt: ['$roomType.roomTypeId', 0]
          }
        }
      }
    ]);

    if (ratePlanTotalResult && ratePlanTotalResult.length > 0) {
      // Extract the roomTypeId from the result
      const roomTypeId = ratePlanTotalResult[0].roomTypeId;

      // Find the corresponding rate document using roomTypeId
      const rateDocument = await rateModel.findOne({ propertyId, roomTypeId });

      if (rateDocument) {
        // Extract the baseRate array from the rateDocument
        const baseRateArray = rateDocument.manageRates.baseRate;

        // Now, you can directly assign the baseRates to the first object in ratePlanTotalResult
        ratePlanTotalResult[0].baseRates = baseRateArray.map((baseRateEntry) => ({
          date: baseRateEntry.date,
          baseRate: baseRateEntry.baseRate,
        }));

        return res.status(200).json({ data: ratePlanTotalResult });
      } else {
        return res.status(404).json({ message: 'Rate data not found for the specified roomTypeId', statuscode: 404 });
      }
    } else {
      return res.status(404).json({ message: 'RatePlanTotal not found', statuscode: 404 });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error', statuscode: 500 });
  }
};

export default checkRate;
