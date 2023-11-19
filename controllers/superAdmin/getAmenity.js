import amenity from '../../models/superAdmin/amenities.js';
import propertyAmenity from "../../models/amenity.js"

const getAmenities = async (req, res) => {
    try {
        const propertyId = req.query.propertyId;

        if (propertyId) {
            const [amenityData, adminAmenity] = await Promise.all([
                propertyAmenity.find({ propertyId: propertyId, "amenityType.0.amenityType": "Property" }),
                amenity.find({ "amenityType.0.amenityType": "Property" }).lean()
            ]);

            if (!amenityData || amenityData.length === 0) {
                return res.status(404).json({ message: "Amenity data not found", statusCode: 404 });
            }

            const hotelAmenity = amenityData.map((amenity) => ({
                amenityId: amenity.amenityId || "",
                amenityName: amenity.amenityName[0].amenityName || "",
                amenityType: amenity.amenityType[0].amenityType || "",
                amenityIcon: amenity.amenityIcon[0].amenityIcon || "",
                amenityIconLink: amenity.amenityIconLink[0].amenityIconLink || ""
            }));
//
            const convertedAdminAmenity = adminAmenity.map((adminAmenity) => ({
                ...adminAmenity._doc,
                amenityId: adminAmenity.amenityId,
                amenityName: adminAmenity.amenityName[0].amenityName || '',
                amenityType: adminAmenity.amenityType[0].amenityType || '',
                amenityIconLink: adminAmenity.amenityIconLink[0].amenityIconLink || '',
            }));
            const allAmenities = hotelAmenity.concat(convertedAdminAmenity);
            return res.status(200).json({ data: allAmenities, statusCode: 200 });
        } else {
            const findAllAmenities = await amenity.find({ "amenityType.0.amenityType": "Property" }).lean();

            if (findAllAmenities.length > 0) {
                const convertedAmenity = findAllAmenities.map((amenities) => ({
                    ...amenities._doc,
                    amenityId: amenities.amenityId,
                    amenityName: amenities.amenityName[0].amenityName || '',
                    amenityType: amenities.amenityType[0].amenityType || '',
                    amenityIconLink: amenities.amenityIconLink[0].amenityIconLink || '',
                }));

                return res.status(200).json({ data: convertedAmenity, statuscode: 200 });
            } else {
                return res.status(404).json({ message: "No amenities found", statuscode: 404 });
            }
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getAmenities;
