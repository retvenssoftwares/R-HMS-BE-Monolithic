import property from "../../models/property.js";
import adminOta from "../../models/superAdmin/otaModel.js";
import {  findUserByUserIdAndToken } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";

const fetchSource = async (req, res) => {
  try {
    const { propertyId,userId} = req.query;
    const authCodeValue = req.headers['authcode']

    const findUser = await verifiedUser.findOne({ userId:userId })

    if (!findUser || !userId) {
       return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
     }

    const findProperties = await property.findOne({ propertyId }).lean();

    if (!findProperties) {
      return res.status(404).json({ message: "Property not found", statusCode: 404 });
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if(result.success){

    // Extract otaIds from the OTAs array in property schema
    const otaIds = findProperties.OTAs.map((ota) => ota.otaId);
//console.log(otaIds)
    // Find matching ota in adminOta schema based on otaId
    const matchingOtas = await adminOta.find({ "otaId.otaId": { $in: otaIds } }).lean();
// console.log(matchingOtas)
    // If there are matching OTAs, extract otaLogo and otaName
    const otaDetails = matchingOtas.map((ota) => ({
      otaId: ota.otaId[0].otaId,
      otaName: ota.otaName[0].otaName,
    }));

    return res.status(200).json({ data:otaDetails, statusCode: 200 });
}else{
    return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
}
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};

export default fetchSource;