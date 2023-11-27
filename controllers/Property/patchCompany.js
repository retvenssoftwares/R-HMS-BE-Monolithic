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

const updateCompany = async (req, res) => {
  try {
    const { userId, companyId } = req.query;
    const {
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

    if (result.success) {
      const companys = await company.findOne({ companyId: companyId });
      const companyLogData = await companyLogs.findOne({ companyId: companyId });
      if (!companys) {
        return res
          .status(404)
          .json({ message: "Enter valid companyId", statuscode: 404 });
      }
      const role = findUser.role;
      const userRole = role[0].role;
      const currentUTCTime = await getCurrentUTCTimestamp();

      const contractPdfFiles = req.files["contractPdf"];
      var contractPdfs = [];

      if (contractPdfFiles) {
        contractPdfs = await uploadMultipleImagesToS3(contractPdfFiles);
      }
      let imageUrl = "";
      if (req.files["companyLogo"]) {
        imageUrl = await uploadImageToS3(req.files["companyLogo"][0]);
      }

      if (companyLogo) {
        const companyLogoObject = {
          companyLogo: imageUrl,
          logId: randomString.generate(10),
        };
        companys.companyLogo.unshift(companyLogoObject);

        const companyLogoObject2 = {
          companyLogo: imageUrl,
          logId: companyLogoObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.companyLogo.unshift(companyLogoObject2);
      }
      if (companyName) {
        const companyNameObject = {
          companyName: companyName,
          logId: randomString.generate(10),
        };
        companys.companyName.unshift(companyNameObject);

        const companyNameObject2 = {
          companyName: companyName,
          logId: companyNameObject.logId,
          deviceType:deviceType,
          userId:userId,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.companyName.unshift(companyNameObject2);
      }
      if (accountType) {
        const accountTypeObject = {
          accountType: accountType,
          logId: randomString.generate(10),
        };
        companys.accountType.unshift(accountTypeObject);

        const accountTypeObject2 = {
          accountType: accountType,
          logId: accountTypeObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.accountType.unshift(accountTypeObject2);
      }
      if (companyEmail) {
        const companyEmailObject = {
          companyEmail: companyEmail,
          logId: randomString.generate(10),
        };
        companys.companyEmail.unshift(companyEmailObject);

        const companyEmailObject2 = {
          companyEmail: companyEmail,
          logId: companyEmailObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.companyEmail.unshift(companyEmailObject2);
      }
      if (companyWebsite) {
        const companyWebsiteObject = {
          companyWebsite: companyWebsite,
          logId: randomString.generate(10),
        };
        companys.companyWebsite.unshift(companyWebsiteObject);

        const companyWebsiteObject2 = {
          companyWebsite: companyWebsite,
          logId: companyWebsiteObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.companyWebsite.unshift(companyWebsiteObject2);
      }
      if (shortCode) {
        const shortCodeObject = {
          shortCode: shortCode,
          logId: randomString.generate(10),
        };
        companys.shortCode.unshift(shortCodeObject);
        const shortCodeObject2 = {
          shortCode: shortCode,
          logId: shortCodeObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.shortCode.unshift(shortCodeObject2);
      }
      if (registrationNumber) {
        const registrationNumberObject = {
          registrationNumber: registrationNumber,
          logId: randomString.generate(10),
        };
        companys.registrationNumber.unshift(registrationNumberObject);

        const registrationNumberObject2 = {
          registrationNumber: registrationNumber,
          logId: registrationNumberObject.logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress: ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.registrationNumber.unshift(registrationNumberObject2);
      }
      if (taxId) {
        const taxIdObject = {
          taxId: taxId,
          logId: randomString.generate(10),
        };
        companys.taxId.unshift(taxIdObject);
        const taxIdObject2 = {
          taxId: taxId,
          logId: taxIdObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.taxId.unshift(taxIdObject2);
      }
      if (openingBalance) {
        const openingBalanceObject = {
          openingBalance: openingBalance,
          logId: randomString.generate(10),
        };
        companys.openingBalance.unshift(openingBalanceObject);
        const openingBalanceObject2 = {
          openingBalance: openingBalance,
          logId:openingBalanceObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.openingBalance.unshift(openingBalanceObject2);
      }
      if (creditLimit) {
        const creditLimitObject = {
          creditLimit: creditLimit,
          logId: randomString.generate(10),
        };
        companys.creditLimit.unshift(creditLimitObject);
        const creditLimitObject2 = {
          creditLimit: creditLimit,
          logId: creditLimitObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.creditLimit.unshift(creditLimitObject2);
      }
      if (billingCycle) {
        const billingCycleObject = {
          month: month,
          days: days,
          logId: randomString.generate(10),
        };
        companys.billingCycle.unshift(billingCycleObject);
        const billingCycleObject2 = {
          month: month,
          days: days,
          logId: billingCycleObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.billingCycle.unshift(billingCycleObject2);
      }
      if (contactPerson) {
        const contactPersonObject = {
          contactPerson: contactPerson,
          logId: randomString.generate(10),
        };
        companys.contactPerson.unshift(contactPersonObject);
        const contactPersonObject2 = {
          contactPerson: contactPerson,
          logId: contactPersonObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.contactPerson.unshift(contactPersonObject2);
      }
      if (phoneNumber) {
        const phoneNumberObject = {
          phoneNumber: phoneNumber,
          logId: randomString.generate(10),
        };
        companys.phoneNumber.unshift(phoneNumberObject);
        const phoneNumberObject2 = {
          phoneNumber: phoneNumber,
          logId: phoneNumberObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.phoneNumber.unshift(phoneNumberObject2);
      }
      if (personDesignation) {
        const personDesignationObject = {
          personDesignation: personDesignation,
          logId: randomString.generate(10),
        };
        companys.personDesignation.unshift(personDesignationObject);
        const personDesignationObject2 = {
          personDesignation: personDesignation,
          logId: personDesignationObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.personDesignation.unshift(personDesignationObject2);
      }
      if (personEmail) {
        const personEmailObject = {
          personEmail: personEmail,
          logId: randomString.generate(10),
        };
        companys.personEmail.unshift(personEmailObject);
        const personEmailObject2 = {
          personEmail: personEmail,
          logId: personEmailObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.personEmail.unshift(personEmailObject2);
      }
      if (addressLine1) {
        const addressLine1Object = {
          addressLine1: addressLine1,
          logId: randomString.generate(10),
        };
        companys.addressLine1.unshift(addressLine1Object);
        const addressLine1Object2 = {
          addressLine1: addressLine1,
          logId: addressLine1Object.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.addressLine1.unshift(addressLine1Object2);
      }
      if (addressLine2) {
        const addressLine2Object = {
          addressLine2: addressLine2,
          logId: randomString.generate(10),
        };
        companys.addressLine2.unshift(addressLine2Object);
        const addressLine2Object2 = {
          addressLine2: addressLine2,
          logId: addressLine2Object.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.addressLine2.unshift(addressLine2Object2);
      }
      if (country) {
        const countryObject = {
          country: country,
          logId: randomString.generate(10),
        };
        companys.country.unshift(countryObject);
        const countryObject2 = {
          country: country,
          logId: countryObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.country.unshift(countryObject2);
      }
      if (state) {
        const stateObject = {
          state: state,
          logId: randomString.generate(10),
        };
        companys.state.unshift(stateObject);
        const stateObject2 = {
          state: state,
          logId:stateObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.state.unshift(stateObject2);
      }
      if (city) {
        const cityObject = {
          city: city,
          logId: randomString.generate(10),
        };
        companys.city.unshift(cityObject);
        const cityObject2 = {
          city: city,
          logId: cityObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.city.unshift(cityObject2);
      }
      if (zipCode) {
        const zipCodeObject = {
          zipCode: zipCode,
          logId: randomString.generate(10),
        };
        companys.zipCode.unshift(zipCodeObject);
        const zipCodeObject2 = {
          zipCode: zipCode,
          logId: zipCodeObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.zipCode.unshift(zipCodeObject2);
      }
      if (effectiveFrom) {
        const effectiveFromObject = {
          effectiveFrom: effectiveFrom,
          logId: randomString.generate(10),
        };
        companys.effectiveFrom.unshift(effectiveFromObject);
        const effectiveFromObject2 = {
          effectiveFrom: effectiveFrom,
          logId: effectiveFromObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.effectiveFrom.unshift(effectiveFromObject2);
      }
      if (expiration) {
        const expirationObject = {
          expiration: expiration,
          logId: randomString.generate(10),
        };
        companys.expiration.unshift(expirationObject);
        const expirationObject2 = {
          expiration: expiration,
          logId: expirationObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.expiration.unshift(expirationObject2);
      }
      if (contractType) {
        const contractTypeObject = {
          contractType: contractType,
          logId: randomString.generate(10),
        };
        companys.contractType.unshift(contractTypeObject);
        const contractTypeObject2 = {
          contractType: contractType,
          logId: contractTypeObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.contractType.unshift(contractTypeObject2);
      }
      if (creditLimit) {
        const creditLimitObject = {
          creditLimit: creditLimit,
          logId: randomString.generate(10),
        };
        companys.creditLimit.unshift(creditLimitObject);
        const creditLimitObject2 = {
          creditLimit: creditLimit,
          logId: creditLimitObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.creditLimit.unshift(creditLimitObject2);
      }
      if (contractTerms) {
        const contractTermsObject = {
          contractTerms: contractTerms,
          logId: randomString.generate(10),
        };
        companys.contractTerms.unshift(contractTermsObject);
        const contractTermsObject2 = {
          contractTerms: contractTerms,
          logId: contractTermsObject.logId,
          userId:userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime
        };
        companyLogData.contractTerms.unshift(contractTermsObject2);
      }
      if (contractPdfs) {
        const contractPdfObjects =  contractPdfs.map((contractPdfUrl) => ({
            contractPdf: contractPdfUrl,
            logId: randomString.generate(10),
          }));
        companys.contractPdf = contractPdfObjects.concat(companys.contractPdf);
        const contractPdfObjects2 =  contractPdfs.map((contractPdfUrl,index) => ({
            contractPdf: contractPdfUrl,
            logId: contractPdfObjects[index].logId,
            userId:userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime
          }));
        companyLogData.contractPdf = contractPdfObjects2.concat(companyLogData.contractPdf);
      }
      const updatedCompany = await companys.save();
      await companyLogData.save();
      return res
        .status(200)
        .json({ message: "Company updated successfully", statuscode: 200 });
    } else {
      return res
        .status(result.statuscode)
        .json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", statuscode: 500 });
  }
};
export default updateCompany;
