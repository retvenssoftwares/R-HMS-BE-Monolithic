import propertyModel from "../../models/property.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js"
import amenitiesModel from '../../models/amenity.js'
import propertyImage from '../../models/propertyImages.js'
const getPropertyById = async (req, res) => {
    try {
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        const propertyImages = await propertyImage.find({ propertyId: propertyId ,"displayStatus.0.displayStatus": "1"});
        //console.log(propertyImages)
        const findProperty = await propertyModel.findOne({ propertyId }, 'propertyId propertyType starCategory propertyDescription createdOn country propertyAddress1 propertyEmail propertyAddress2 city postCode propertyName rating amenities hotelLogo state -_id').lean();
        if (!findProperty) {
            return res.status(404).json({ message: "Property not found", statuscode: 404 });
        }

        let amenities = '';
        let amenityNames = []; // Define amenityNames here
        if (findProperty.amenities && findProperty.amenities.length > 0) {
            amenities = findProperty.amenities[0].amenities;
            const allAmenities = amenities.map((item) => item.amenityId)
          //  console.log(allAmenities)
            const foundAmenity = await amenitiesModel.find({ amenityId: { $in: allAmenities } });
             amenityNames = foundAmenity.map((foundAmenity) => ({
                amenityName: foundAmenity.amenityName[0].amenityName,
                amenityIconLink: foundAmenity.amenityIconLink[0].amenityIconLink,
                amenityId: foundAmenity.amenityId,
                amenityType: foundAmenity.amenityType[0].amenityType
            }))
          //  console.log(amenityNames)
        }

            // propertyImages
            const filteredPropertyImages = propertyImages.filter(img => img.propertyId === propertyId);
             // console.log(filteredPropertyImages)
              // Extract all images for all rooms into a single array
           const imagesData = [].concat(...filteredPropertyImages.map(img => img.propertyImages.map(image => ({ image: image.image }))));

     
        // Fetch the 0th object for array fields
        const planData = {
            ...findProperty,
            propertyId: propertyId,
            phone:findProperty.phone || '',
            reservationPhone:findProperty.reservationPhone || '',
            websiteUrl:findProperty.websiteUrl || '',
            latitude: findProperty.location && findProperty.location.length > 0 ? findProperty.location[0].latitude : '',
            longitude: findProperty.location && findProperty.location.length > 0 ? findProperty.location[0].longitude : '',
            propertyType: findProperty.propertyType || "",
            starCategory: findProperty.starCategory || "",
            propertyDescription: findProperty.propertyDescription.length > 0 ? findProperty.propertyDescription[0].propertyDescription : "",
            createdOn: findProperty.createdOn || "",
            country: findProperty.country || "",
            propertyAddress1: findProperty.propertyAddress1.length > 0 ? findProperty.propertyAddress1[0].propertyAddress1 : "",
            propertyAddress2: findProperty.propertyAddress2.length > 0 ? findProperty.propertyAddress2[0].propertyAddress2 : "",
            propertyEmail: findProperty.propertyEmail.length > 0 ? findProperty.propertyEmail[0].propertyEmail : "",
            city: findProperty.city.length > 0 ? findProperty.city[0].city : "",
            postCode: findProperty.postCode.length > 0 ? findProperty.postCode[0].postCode : "",
            propertyName: findProperty.propertyName.length > 0 ? findProperty.propertyName[0].propertyName : "",
            rating: findProperty.rating.length > 0 ? findProperty.rating[0].rating : "",
            amenities: amenityNames || [], 
            propertyImages:imagesData,
            hotelLogo: findProperty.hotelLogo.length > 0 ? findProperty.hotelLogo[0].hotelLogo : "",
            state: findProperty.state.length > 0 ? findProperty.state[0].state : ""
        };



        return res.status(200).json({ data: planData, statuscode: 200 });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}

export default getPropertyById