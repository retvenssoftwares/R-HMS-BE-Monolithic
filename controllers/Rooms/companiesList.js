import companyModel from "../../models/company.js";
// import propertyModel from "../../";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const companyNames = async (req, res) => {
  try {
    const { userId, propertyId } = req.query;

    const authCodeValue = req.headers['authcode']
    const result = await findUserByUserIdAndToken(userId, authCodeValue)
    if (result.success) {
      const findCompanyName = await companyModel.find({ propertyId }).select('companyName companyId').lean();

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
        return res.status(404).json({ message: "No companies found", status: 404 });
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
