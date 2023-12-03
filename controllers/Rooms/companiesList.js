import companyModel from "../../models/company.js";
// import propertyModel from "../../";
import { findUserByUserIdAndToken, validateHotelCode } from "../../helpers/helper.js";

const companyNames = async (req, res) => {
  try {
    const { userId, propertyId } = req.query;

    const authCodeValue = req.headers['authcode']
    const result = await findUserByUserIdAndToken(userId, authCodeValue)
    if (result.success) {
      if(!propertyId){
        return res.status(400).json({message: "Please enter propertyId", statuscode: 400})
      }

      const result = await validateHotelCode(userId, propertyId)
      if (!result.success) {
        return res.status(result.statuscode).json({ message: "Invalid propertyId entered", statuscode: result.statuscode })
      }
      const findCompanyName = await companyModel.find({ propertyId,"displayStatus.0.displayStatus":"1" }).select('companyName companyId').lean();

      if (findCompanyName.length > 0) {
        const foundData = findCompanyName.map((companyData) => {
          return {
            ...companyData._doc,
            companyName: companyData.companyName[0].companyName || "",
            companyId: companyData.companyId || ""
          }
        })
        return res.status(200).json({ data: foundData, statuscode: 200 });

      } else {
        return res.status(200).json({ message: "No companies found", status: 200 });
      }
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
  }
};

export default companyNames;
