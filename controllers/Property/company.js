import logsModel from "../../models/logsModel.js"
import company from "../../models/company.js"
import randomString from "randomstring"
import {
    getCurrentUTCTimestamp,
    getCurrentLocalTimestamp,
    uploadImageToS3
  } from "../../helpers/helper.js";
export const addCompany = async(req,res)=>{
    const findUser = await verifiedUser.findOne({ userId });
    const authCodeValue = req.headers['authcode']
    const userToken = findUser.authCode;

    if (!findUser || !userId) {
      return res.status(404).json({ message: "User not found", statuscode: 404 });
    }

    if (authCodeValue !== userToken) {
      return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
    }

    let image = await uploadImageToS3(req.file)

    const add = new company({
            propertyId : req.body.propertyId,
            companyId : randomString.generate(7),
            companyLogo : image,
            companyName:req.body.companyName,
            companyType : req.body.companyType,
            registrationNumber : req.body.registrationNumber,
            taxId : req.body.taxId,
            accountDetails : req.body.accountDetails,
            contactDetails : req.body.contactDetails,
            companyAddress : req.body.companyAddress,
            createdDate : getCurrentUTCTimestamp(),
            createdBy : req.body.createdBy,
            
    })

    await add.save()
}