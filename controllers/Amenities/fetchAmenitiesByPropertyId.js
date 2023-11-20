import amenityModel from '../../models/amenity.js';
import { findUserByUserIdAndToken } from '../../helpers/helper.js';
const fetchAmenity = async (req, res) => {
  try {
    const { propertyId, amenityType, userId } = req.query; // Extract amenityType from the request query.
    const authCodeValue = req.headers['authcode']
    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if (result.success) {
      const findAllAmenities = await amenityModel.find({ propertyId }).lean();
      if (findAllAmenities.length > 0) {
        const matchStage = { propertyId };
        // If amenityType is provided, match it exactly to "Rooms" or "property."
        if (amenityType) {
          matchStage['amenityType.0.amenityType'] = amenityType;
        }

        const amenities = await amenityModel.aggregate([
          {
            $match: matchStage,
          },
          {
            $project: {
              _id: 0,
              amenityName: { $arrayElemAt: ['$amenityName.amenityName', 0] },
              amenityIconLink: { $arrayElemAt: ['$amenityIconLink.amenityIconLink', 0] },
            },
          },
        ]);

        res.json({ data: amenities });
      } else {
        return res.status(404).json({ message: "No Amenity found or invalid propertyId", statuscode: 404 });
      }
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', statuscode: 500 });
  }
};

export default fetchAmenity;
