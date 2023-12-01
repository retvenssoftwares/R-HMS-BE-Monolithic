import * as dotenv from "dotenv";
dotenv.config();
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";
import employeeModel from "../../models/houseKeepingModel.js";

const fetchEmployeeById = async (req, res) => {

    try {
        const { employeeId, userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const findEmployee = await employeeModel.findOne({ employeeId }, '-_id').lean();
        if (!findEmployee) {
            return res.status(404).json({ message: "Please enter valid employeeId", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            if (findEmployee) {
                const employeeData = {
                    ...findEmployee,
                    employeeId: employeeId,
                    propertyId: findEmployee.propertyId || '',
                    profilePhoto: findEmployee.profilePhoto[0].profilePhoto || '',
                    fullName: findEmployee.fullName[0].fullName || '',
                    websiteUrl: findEmployee.websiteUrl || '',
                    latitude: findEmployee.location && findEmployee.location.length > 0 ? findEmployee.location[0].latitude : '',
                    longitude: findEmployee.location && findEmployee.location.length > 0 ? findEmployee.location[0].longitude : '',
                    propertyType: findEmployee.propertyType || "",
                    starCategory: findEmployee.starCategory || "",
                    propertyDescription: findEmployee.propertyDescription.length > 0 ? findEmployee.propertyDescription[0].propertyDescription : "",
                    createdOn: findEmployee.createdOn || "",
                    country: findEmployee.country || "",
                    propertyAddress1: findEmployee.propertyAddress1.length > 0 ? findEmployee.propertyAddress1[0].propertyAddress1 : "",
                    propertyAddress2: findEmployee.propertyAddress2.length > 0 ? findEmployee.propertyAddress2[0].propertyAddress2 : "",
                    propertyEmail: findEmployee.propertyEmail.length > 0 ? findEmployee.propertyEmail[0].propertyEmail : "",
                    city: findEmployee.city.length > 0 ? findEmployee.city[0].city : "",
                    postCode: findEmployee.postCode.length > 0 ? findEmployee.postCode[0].postCode : "",
                    propertyName: findEmployee.propertyName.length > 0 ? findEmployee.propertyName[0].propertyName : "",
                    rating: findEmployee.rating.length > 0 ? findEmployee.rating[0].rating : "",
                    amenities: amenityNames || [],
                    // propertyImages:imagesData,
                    hotelLogo: findEmployee.hotelLogo.length > 0 ? findEmployee.hotelLogo[0].hotelLogo : "",
                    state: findEmployee.state.length > 0 ? findEmployee.state[0].state : ""
                };
                return res.status(200).json({ data: employeeData, statuscode: 200 })
            } else {
                return res.status(200).json({ message: "No company found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};

export default fetchEmployeeById;
