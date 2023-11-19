import propertyModel from "../../models/property.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js"
const getPropertyById = async (req, res) => {
    try {
        const { userId, propertyId } = req.query
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

        const findProperty = await propertyModel.findOne({ propertyId }, 'propertyId propertyType starCategory propertyDescription createdOn country propertyAddress1 propertyEmail propertyAddress2 city postCode propertyName rating amenities hotelLogo state -_id').lean();
        if (!findProperty) {
            return res.status(404).json({ message: "Property not found", statuscode: 404 });
        }
        // Fetch the 0th object for array fields
        const planData = {
            ...findProperty,
            propertyId: propertyId,
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
            amenities: findProperty.amenities.length > 0 ? findProperty.amenities[0].amenities : "",
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