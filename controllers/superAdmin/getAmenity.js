import amenity from '../../models/superAdmin/amenities.js';


const getAmenities = async (req, res) => {
    try {
            const findAllAmenities = await amenity.find({}).lean();

            if (findAllAmenities.length > 0) {
                const convertedAmenity = findAllAmenities.map(amenities => {
                 
                    return {
                        ...amenities._doc,
                       amenityId:amenities.amenityId,
                        amenityName: amenities.amenityName[0].amenityName || '',
                        amenityType: amenities.amenityType[0].amenityType || '',
                        amenityIconLink: amenities.amenityIconLink[0].amenityIconLink || '',
                    };
                });

                return res.status(200).json({ data: convertedAmenity, statuscode: 200 });
            } else {
                return res.status(404).json({ message: "No amenities found", statuscode: 404 });
            }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getAmenities;
