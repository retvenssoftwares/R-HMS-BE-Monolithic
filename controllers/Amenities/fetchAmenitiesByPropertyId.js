import amenityModel from '../../models/amenity.js';

const fetchAmenity = async (req, res) => {
  try {
    const { propertyId } = req.query;

    const amenities = await amenityModel.aggregate([
      {
        $match: {
          propertyId: propertyId,
        },
      },
      {
        $project: {
          _id: 0,
          amenityName: { $arrayElemAt: ['$amenityName.amenityName', 0] },
          amenityIconLink: { $arrayElemAt: ['$amenityIconLink.amenityIconLink', 0] },
        },
      },
    ]);

    res.json({data:amenities});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default fetchAmenity;
