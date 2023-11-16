import amenity from '../../models/superAdmin/amenities.js';
import propertyAmenity from "../../models/amenity.js"
import amenities from '../../models/superAdmin/amenities.js';

const getAmenities = async (req, res) => {
    try {

            const propertyId = req.query.propertyId
            if(propertyId){
                const amenityData = await propertyAmenity.find({propertyId :  propertyId})

                var hotelAmenity = []

                if(!amenityData){
                    return res.status(404).json({message : "amenity data not found" , statusCode : 404})
                }


            for(let i = 0 ; i < amenityData.length ; i++ ){

                const amenityData = await propertyAmenity.find({propertyId :  propertyId})
                const data = {
                    propertyId : amenityData[i].propertyId || "",
                    createdBy : amenityData[i].createdBy || "",
                    createdOn : amenityData[i].createdBy || "",
                    amenityId : amenityData[i].amenityId || "",
                    amenityName : amenityData[i].amenityName[0].amenityName || "",
                    amenityType : amenityData[i].amenityType[0].amenityType || "",
                    amenityIcon : amenityData[i].amenityIcon[0].amenityIcon || "",
                    amenityIconLink : amenityData[i].amenityIconLink[0].amenityIconLink || ""
                }

                hotelAmenity.push(data)
            }


            return res.status(200).json({data : hotelAmenity  , statusCode : 200})     

            }else{
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
            }
            
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getAmenities;
