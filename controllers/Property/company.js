import logsModel from "../../models/logsModel.js"
import company from "../../models/company.js"
import randomString from "randomstring"
import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
  uploadImageToS3
} from "../../helpers/helper.js";
export const addCompany = async (req, res) => {
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
    propertyId: req.body.propertyId,
    companyId: randomString.generate(7),
    companyLogo: [{
      companyLogo: image,
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
      personDesignation: {
          type: String,
          default: "",
      },
      logId: {
          type: String,
          default: "",
      }
  }],
    companyAddress: req.body.companyAddress,
    createdDate: getCurrentUTCTimestamp(),
    createdBy: req.body.createdBy,

  })

  await add.save()


}