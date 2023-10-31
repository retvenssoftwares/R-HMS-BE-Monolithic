import amenityModel from '../../models/amenity.js';

const fetchAmenity = async (req, res) => {
  try {
    const { propertyId, amenityType } = req.query; // Extract amenityType from the request query.

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default fetchAmenity;
