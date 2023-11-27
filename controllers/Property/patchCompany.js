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
      const companyData = await companyLogs.findOne({ companyId: companyId });
      if (!companys) {
        return res
          .status(404)
          .json({ message: "Enter valid companyId", statuscode: 404 });
      }
      const role = findUser.role;
      const userRole = role[0].role;
      const createdOn = getCurrentUTCTimestamp();
      const createdBy = userRole;

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
      }
      if (companyName) {
        const companyNameObject = {
          companyName: companyName,
          logId: randomString.generate(10),
        };
        companys.companyName.unshift(companyNameObject);
      }
      if (accountType) {
        const accountTypeObject = {
          accountType: accountType,
          logId: randomString.generate(10),
        };
        companys.accountType.unshift(accountTypeObject);
      }
      if (companyEmail) {
        const companyEmailObject = {
          companyEmail: companyEmail,
          logId: randomString.generate(10),
        };
        companys.companyEmail.unshift(companyEmailObject);
      }
      if (companyWebsite) {
        const companyWebsiteObject = {
          companyWebsite: companyWebsite,
          logId: randomString.generate(10),
        };
        companys.companyWebsite.unshift(companyWebsiteObject);
      }
      if (shortCode) {
        const shortCodeObject = {
          shortCode: shortCode,
          logId: randomString.generate(10),
        };
        companys.shortCode.unshift(shortCodeObject);
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
        };
        companyData.registrationNumber.unshift(registrationNumberObject2);
      }
      if (taxId) {
        const taxIdObject = {
          taxId: taxId,
          logId: randomString.generate(10),
        };
        companys.taxId.unshift(taxIdObject);
      }
      if (openingBalance) {
        const openingBalanceObject = {
          openingBalance: openingBalance,
          logId: randomString.generate(10),
        };
        companys.openingBalance.unshift(openingBalanceObject);
      }
      if (creditLimit) {
        const creditLimitObject = {
          creditLimit: creditLimit,
          logId: randomString.generate(10),
        };
        companys.creditLimit.unshift(creditLimitObject);
      }
      if (billingCycle) {
        const billingCycleObject = {
          month: month,
          days: days,
          logId: randomString.generate(10),
        };
        companys.billingCycle.unshift(billingCycleObject);
      }
      if (contactPerson) {
        const contactPersonObject = {
          contactPerson: contactPerson,
          logId: randomString.generate(10),
        };
        companys.contactPerson.unshift(contactPersonObject);
      }
      if (phoneNumber) {
        const phoneNumberObject = {
          phoneNumber: phoneNumber,
          logId: randomString.generate(10),
        };
        companys.phoneNumber.unshift(phoneNumberObject);
      }
      if (personDesignation) {
        const personDesignationObject = {
          personDesignation: personDesignation,
          logId: randomString.generate(10),
        };
        companys.personDesignation.unshift(personDesignationObject);
      }
      if (personEmail) {
        const personEmailObject = {
          personEmail: personEmail,
          logId: randomString.generate(10),
        };
        companys.personEmail.unshift(personEmailObject);
      }
      if (addressLine1) {
        const addressLine1Object = {
          addressLine1: addressLine1,
          logId: randomString.generate(10),
        };
        companys.addressLine1.unshift(addressLine1Object);
      }
      if (addressLine2) {
        const addressLine2Object = {
          addressLine2: addressLine2,
          logId: randomString.generate(10),
        };
        companys.addressLine2.unshift(addressLine2Object);
      }
      if (country) {
        const countryObject = {
          country: country,
          logId: randomString.generate(10),
        };
        companys.country.unshift(countryObject);
      }
      if (state) {
        const stateObject = {
          state: state,
          logId: randomString.generate(10),
        };
        companys.state.unshift(stateObject);
      }
      if (city) {
        const cityObject = {
          city: city,
          logId: randomString.generate(10),
        };
        companys.city.unshift(cityObject);
      }
      if (zipCode) {
        const zipCodeObject = {
          zipCode: zipCode,
          logId: randomString.generate(10),
        };
        companys.zipCode.unshift(zipCodeObject);
      }
      if (effectiveFrom) {
        const effectiveFromObject = {
          effectiveFrom: effectiveFrom,
          logId: randomString.generate(10),
        };
        companys.effectiveFrom.unshift(effectiveFromObject);
      }
      if (expiration) {
        const expirationObject = {
          expiration: expiration,
          logId: randomString.generate(10),
        };
        companys.expiration.unshift(expirationObject);
      }
      if (contractType) {
        const contractTypeObject = {
          contractType: contractType,
          logId: randomString.generate(10),
        };
        companys.contractType.unshift(contractTypeObject);
      }
      if (creditLimit) {
        const creditLimitObject = {
          creditLimit: creditLimit,
          logId: randomString.generate(10),
        };
        companys.creditLimit.unshift(creditLimitObject);
      }
      if (contractTerms) {
        const contractTermsObject = {
          contractTerms: contractTerms,
          logId: randomString.generate(10),
        };
        companys.contractTerms.unshift(contractTermsObject);
      }
      if (contractPdf) {
        const contractPdfObject = {
          contractPdf: contractPdfs.map((contractPdfUrl) => ({
            contractPdf: contractPdfUrl,
            logId: randomString.generate(10),
          })),
        };
        companys.contractPdf.unshift(contractPdfObject);
      }
      const updatedCompany = await companys.save();
      await companyData.save();
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
