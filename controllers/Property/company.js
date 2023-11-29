import logsModel from "../../models/logsModel.js";
import company from "../../models/company.js";
import verifiedUser from "../../models/verifiedUsers.js";
import randomString from "randomstring";
import {
  getCurrentUTCTimestamp,
  findUserByUserIdAndToken,
  uploadImageToS3,
  uploadMultipleImagesToS3,
} from "../../helpers/helper.js";
import companyLogs from "../../models/LogModels/companyLogs.js";
import companyLedger from "../../models/companyLedger.js"

const addCompany = async (req, res) => {
  try {
    const {
      userId,
      propertyId,
      companyLogo,
      companyName,
      accountType,
      companyEmail,
      companyWebsite,
      shortCode,
      registrationNumber,
      taxId,
      openingBalance,
      creditLimit,
      billingCycle,
      contactPerson,
      phoneNumber,
      personDesignation,
      personEmail,
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      zipCode,
      effectiveFrom,
      expiration,
      contractType,
      contractTerms,
      contractPdf,
      days,
      month,
      deviceType,
      ipAddress,
    } = req.body;
    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser || !userId) {
      return res
        .status(404)
        .json({ message: "User not found or invalid userId", statuscode: 404 });
    }
    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    const currentUTCTime = await getCurrentUTCTimestamp();

    if (result.success) {
      const role = findUser.role;
      const userRole = role[0].role;

      const contractPdfFiles = req.files["contractPdf"];
      let contractPdfs = [];
      

      if (contractPdfFiles) {
        contractPdfs = await uploadMultipleImagesToS3(contractPdfFiles);
      }

      let imageUrl = "";
      if (req.files["companyLogo"]) {
        imageUrl = await uploadImageToS3(req.files["companyLogo"][0]);
      }

      const addCompanyRecord = new company({
        propertyId: propertyId,
        companyId: randomString.generate(7),
        companyLogo: [
          {
            companyLogo: imageUrl,
            logId: randomString.generate(10),
          },
        ],
        companyName: [
          {
            companyName: companyName,
            logId: randomString.generate(10),
          },
        ],
        displayStatus: [
          {
            displayStatus: "1",
            logId: randomString.generate(10),
          },
        ],
        accountType: [
          {
            accountType: accountType,
            logId: randomString.generate(10),
          },
        ],
        companyEmail: [
          {
            companyEmail: companyEmail,
            logId: randomString.generate(10),
          },
        ],
        companyWebsite: [
          {
            companyWebsite: companyWebsite,
            logId: randomString.generate(10),
          },
        ],
        shortCode: [
          {
            shortCode: shortCode,
            logId: randomString.generate(10),
          },
        ],
        registrationNumber: [
          {
            registrationNumber: registrationNumber,
            logId: randomString.generate(10),
          },
        ],
        taxId: [
          {
            taxId: taxId,
            logId: randomString.generate(10),
          },
        ],
        openingBalance: [
          {
            openingBalance: openingBalance,
            logId: randomString.generate(10),
          },
        ],
        billingCycle: [
          {
            month: month,
            days: days,
            logId: randomString.generate(10),
          },
        ],
        contactPerson: [
          {
            contactPerson: contactPerson,
            logId: randomString.generate(10),
          },
        ],
        phoneNumber: [
          {
            phoneNumber: phoneNumber,
            logId: randomString.generate(10),
          },
        ],
        personDesignation: [
          {
            personDesignation: personDesignation,
            logId: randomString.generate(10),
          },
        ],

        personEmail: [
          {
            personEmail: personEmail,
            logId: randomString.generate(10),
          },
        ],
        addressLine1: [
          {
            addressLine1: addressLine1,
            logId: randomString.generate(10),
          },
        ],
        addressLine2: [
          {
            addressLine2: addressLine2,
            logId: randomString.generate(10),
          },
        ],
        country: [
          {
            country: country,
            logId: randomString.generate(10),
          },
        ],

        state: [
          {
            state: state,
            logId: randomString.generate(10),
          },
        ],

        city: [
          {
            city: city,
            logId: randomString.generate(10),
          },
        ],

        zipCode: [
          {
            zipCode: zipCode,
            logId: randomString.generate(10),
          },
        ],

        effectiveFrom: [
          {
            effectiveFrom: effectiveFrom,
            logId: randomString.generate(10),
          },
        ],

        expiration: [
          {
            expiration: expiration,
            logId: randomString.generate(10),
          },
        ],

        contractType: [
          {
            contractType: contractType,
            logId: randomString.generate(10),
          },
        ],

        creditLimit: [
          {
            creditLimit: creditLimit,
            logId: randomString.generate(10),
          },
        ],

        contractTerms: [
          {
            contractTerms: contractTerms,
            logId: randomString.generate(10),
          },
        ],

        contractPdf: contractPdfs.map((contractPdfUrl) => ({
          contractPdf: contractPdfUrl,
          logId: randomString.generate(10),
        })),

        createdOn: currentUTCTime,
        createdBy: userRole,
      });

      const companyData = await addCompanyRecord.save();
      

      const addComapnyLedger = companyLedger({
        companyId: companyData.companyId,

        propertyId: companyData.propertyId || "",

        date: await getCurrentUTCTimestamp(),

        openingBalance: [
          {
            openingBalance: companyData.openingBalance[0].openingBalance || 0,
            logId: randomString.generate(10),
          },
        ],

        creditLimit: [
          {
            creditLimit: companyData.creditLimit[0].creditLimit || "",
            logId: randomString.generate(10),
          },
        ],

        totalBalance: [
          {
            totalBalance: companyData.openingBalance[0].openingBalance || 0,
            logId: randomString.generate(10),
          },
        ],

      });

      await addComapnyLedger.save();

      //save data in logs
      const addCompanyLogs = new companyLogs({
        userId: userId,
        propertyId: propertyId,
        companyId: companyData.companyId,
        createdBy: userRole,
        createdOn: currentUTCTime,
        companyLogo: [
          {
            companyLogo: imageUrl,
            logId: companyData.companyLogo[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        displayStatus: [
          {
            displayStatus:companyData.displayStatus[0].displayStatus,
            logId: companyData.displayStatus[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        companyName: [
          {
            companyName: companyName,
            logId: companyData.companyName[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        accountType: [
          {
            accountType: accountType,
            logId: companyData.accountType[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        companyEmail: [
          {
            companyEmail: companyEmail,
            logId: companyData.companyEmail[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        companyWebsite: [
          {
            companyWebsite: companyWebsite,
            logId: companyData.companyWebsite[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        shortCode: [
          {
            shortCode: shortCode,
            logId: companyData.shortCode[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        registrationNumber: [
          {
            registrationNumber: registrationNumber,
            logId: companyData.registrationNumber[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        taxId: [
          {
            taxId: taxId,
            logId: companyData.taxId[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        openingBalance: [
          {
            openingBalance: openingBalance,
            logId: companyData.openingBalance[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        billingCycle: [
          {
            month: month,
            days: days,
            logId: companyData.billingCycle[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        contactPerson: [
          {
            contactPerson: contactPerson,
            logId: companyData.contactPerson[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        phoneNumber: [
          {
            phoneNumber: phoneNumber,
            logId: companyData.phoneNumber[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        personDesignation: [
          {
            personDesignation: personDesignation,
            logId: companyData.personDesignation[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        personEmail: [
          {
            personEmail: personEmail,
            logId: companyData.personEmail[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        addressLine1: [
          {
            addressLine1: addressLine1,
            logId: companyData.addressLine1[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        addressLine2: [
          {
            addressLine2: addressLine2,
            logId: companyData.addressLine2[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        country: [
          {
            country: country,
            logId: companyData.country[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        state: [
          {
            state: state,
            logId: companyData.state[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        city: [
          {
            city: city,
            logId: companyData.city[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        zipCode: [
          {
            zipCode: zipCode,
            logId: companyData.zipCode[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        effectiveFrom: [
          {
            effectiveFrom: effectiveFrom,
            logId: companyData.effectiveFrom[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        expiration: [
          {
            expiration: expiration,
            logId: companyData.expiration[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        contractType: [
          {
            contractType: contractType,
            logId: companyData.contractType[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        creditLimit: [
          {
            creditLimit: creditLimit,
            logId: companyData.creditLimit[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        contractTerms: [
          {
            contractTerms: contractTerms,
            logId: companyData.contractTerms[0].logId,
            userId: userId,
            modifiedOn: currentUTCTime,
            deviceType: deviceType,
            ipAddress: ipAddress,
          },
        ],
        contractPdf: contractPdfs.map((contractPdfUrl) => ({
          contractPdf: contractPdfUrl,
          logId: companyData.contractPdf[0].logId,
          userId: userId,
          modifiedOn: currentUTCTime,
          deviceType: deviceType,
          ipAddress: ipAddress,
      })),
      
      });

      await addCompanyLogs.save();
      

      return res
        .status(200)
        .json({ message: "Company added successfully", statuscode: 200 });
    } else {
      return res
        .status(result.statuscode)
        .json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default addCompany;