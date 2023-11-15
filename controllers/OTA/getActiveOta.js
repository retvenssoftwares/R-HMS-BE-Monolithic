// import property from "../../models/property.js";
// import adminOta from "../../models/superAdmin/otaModel.js";

// const fetchOta = async (req, res) => {
//   try {
//     const { propertyId } = req.query;
//     const findProperties = await property.findOne({ propertyId }).lean();

//     if (!findProperties) {
//       return res.status(404).json({ message: "Property not found", statusCode: 404 });
//     }

//     // Extract otaIds from the OTAs array in property schema
//     const otaIds = findProperties.OTAs.map((ota) => ota.otaId);
// //console.log(otaIds)
//     // Find matching ota in adminOta schema based on otaId
//     const matchingOtas = await adminOta.find({ "otaId.otaId": { $in: otaIds } }).lean();
// // console.log(matchingOtas)
//     // If there are matching OTAs, extract otaLogo and otaName
//     const otaDetails = matchingOtas.map((ota) => ({
//       otaLogo: ota.otaLogo[0].otaLogo,
//       otaName: ota.otaName[0].otaName,
//     }));

//     return res.status(200).json({ Active:otaDetails, statusCode: 200 });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error", statusCode: 500 });
//   }
// };

// export default fetchOta;




import property from "../../models/property.js";
import adminOta from "../../models/superAdmin/otaModel.js";
import {  findUserByUserIdAndToken } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";

const fetchOta = async (req, res) => {
  try {
    const { propertyId,userId } = req.query;
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

    // Find matching active OTAs in adminOta schema based on otaId and isConfig
    const activeMatchingOtas = await adminOta.find({ "otaId.otaId": { $in: otaIds }}).lean();

    // Find matching inactive OTAs in adminOta schema based on otaId and isConfig
    const inactiveMatchingOtas = await adminOta.find({ "otaId.otaId": { $nin: otaIds }, isConfig: "true" }).lean();

    //find matcing upComing OTA in adminOta schema based on is Config
    const upComingOtas =await adminOta.find({isConfig: "false" }).lean();


    // If there are matching active OTAs, extract otaLogo and otaName
    const activeOtaDetails = activeMatchingOtas.map((ota) => ({
      otaId: ota.otaId[0].otaId,
      otaLogo: ota.otaLogo[0].otaLogo,
      otaName: ota.otaName[0].otaName,
    }));

    // If there are matching inactive OTAs, extract otaLogo and otaName
    const inactiveOtaDetails = inactiveMatchingOtas.map((ota) => ({
      otaId: ota.otaId[0].otaId,
      otaLogo: ota.otaLogo[0].otaLogo,
      otaName: ota.otaName[0].otaName,
    }));

    //if there are matcing upcoming OTAs extract otaLogo and OtaName
    const upComingOtaDetails = upComingOtas.map((ota) => ({
      otaId: ota.otaId[0].otaId,
        otaLogo: ota.otaLogo[0].otaLogo,
        otaName: ota.otaName[0].otaName,
      }));


    return res.status(200).json({ Active: activeOtaDetails, inActive: inactiveOtaDetails,upComing:upComingOtaDetails, statusCode: 200 });
    }else{
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};

export default fetchOta;
