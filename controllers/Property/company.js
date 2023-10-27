import logsModel from "../../models/logsModel.js"
import company from "../../models/company.js"
import verifiedUser from "../../models/verifiedUsers.js";
import randomString from "randomstring"
import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
  uploadImageToS3,
  uploadMultipleImagesToS3
} from "../../helpers/helper.js";

const addCompany = async (req, res) => {
  try {
    const { userId } = req.query
    const findUser = await verifiedUser.findOne({ userId });
    // const authCodeValue = req.headers['authcode']
    // const userToken = findUser.authCode;

    if (!findUser || !userId) {
      return res.status(404).json({ message: "User not found", statuscode: 404 });
    }

    const role = findUser.role
    const userRole = role[0].role

    // if (authCodeValue !== userToken) {
    //   return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
    // }
    const contractPdfFiles = req.files['contractPdf'];
    let contractPdfs = [];

    if (contractPdfFiles) {
      contractPdfs = await uploadMultipleImagesToS3(contractPdfFiles);
    }

    let imageUrl = ''
    if (req.files['companyLogo']) {
      imageUrl = await uploadImageToS3(req.files['companyLogo'][0]);
    }


    const addCompanyRecord = new company({
      propertyId: req.body.propertyId,
      companyId: randomString.generate(7),
      companyLogo: [{
        companyLogo: imageUrl,
        logId: randomString.generate(10)
      }],
      companyName: [{
        companyName: req.body.companyName,
        logId: randomString.generate(10)
      }],
      accountType: [{
        accountType: req.body.accountType,
        logId: randomString.generate(10)
      }],
      companyEmail: [{
        companyEmail: req.body.companyEmail,
        logId: randomString.generate(10)
      }],
      companyWebsite: [{
        companyWebsite: req.body.companyWebsite,
        logId: randomString.generate(10)
      }],
      shortCode: [{
        shortCode: req.body.shortCode,
        logId: randomString.generate(10)
      }],
      registrationNumber: [{
        registrationNumber: req.body.registrationNumber,
        logId: randomString.generate(10)
      }],
      taxId: [{
        taxId: req.body.taxId,
        logId: randomString.generate(10)
      }],
      openingBalance: [{
        openingBalance: req.body.openingBalance,
        logId: randomString.generate(10)
      }],
      creditLimit: [{
        creditLimit: req.body.creditLimit,
        logId: randomString.generate(10)
      }],
      billingCycle: [{
        month: req.body.month,
        days: req.body.days,
        logId: randomString.generate(10)
      }],
      contactPerson: [{
        contactPerson: req.body.contactPerson,
        logId: randomString.generate(10)
      }],
      phoneNumber: [{
        phoneNumber: req.body.phoneNumber,
        logId: randomString.generate(10)
      }],
      personDesignation: [{
        personDesignation: req.body.personDesignation,
        logId: randomString.generate(10)
      }],

      personEmail: [{
        personEmail: req.body.personEmail,
        logId: randomString.generate(10)
      }],
      addressLine1: [{
        addressLine1: req.body.addressLine1,
        logId: randomString.generate(10)
      }],
      addressLine2: [{
        addressLine2: req.body.addressLine2,
        logId: randomString.generate(10)
      }],
      country: [{
        country: req.body.country,
        logId: randomString.generate(10)
      }],

      state: [{
        state: req.body.state,
        logId: randomString.generate(10)
      }],

      city: [{
        city: req.body.city,
        logId: randomString.generate(10)
      }],


      zipCode: [{
        zipCode: req.body.zipCode,
        logId: randomString.generate(10)
      }],

      effectiveFrom: [{
        effectiveFrom: req.body.effectiveFrom,
        logId: randomString.generate(10)
      }],

      expiration: [{
        expiration: req.body.expiration,
        logId: randomString.generate(10)
      }],

      contractType: [{
        contractType: req.body.contractType,
        logId: randomString.generate(10)
      }],

      creditLimit: [{
        creditLimit: req.body.creditLimit,
        logId: randomString.generate(10)
      }],

      contractTerms: [{
        contractTerms: req.body.contractTerms,
        logId: randomString.generate(10)
      }],

      contractPdf: contractPdfs.map((contractPdfUrl) => ({
        contractPdf: contractPdfUrl,
        logId: randomString.generate(10),
      })),

      createdDate: getCurrentUTCTimestamp(),
      createdBy: userRole,

    })

    await addCompanyRecord.save()
    return res.status(200).json({ message: "Company added successfully", statuscode: 200 })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }

}

export default addCompany