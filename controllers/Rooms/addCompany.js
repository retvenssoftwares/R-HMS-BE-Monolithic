import Randomstring from "randomstring";
import company from "../../models/company.js";
import { uploadImageToS3, findUserByUserIdAndToken, getCurrentUTCTimestamp } from "../../helpers/helper.js";
import companyLedger from "../../models/companyLedger.js"
const addCompany = async (req, res) => {
    try {
        const { userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
            var imageUrl = ""
            var contractLink = ""

            if (req.files['companyLogo']) {
                imageUrl = await uploadImageToS3(req.files['companyLogo'][0]);
            }
            if (req.files['contractPdf']) {
                contractLink = await uploadImageToS3(req.files['contractPdf'][0]);
            }
            const addCompanyRecord = new company({
                propertyId: req.body.propertyId,
                companyId: Randomstring.generate(8),
                companyLogo: [{
                    companyLogo: imageUrl
                }],
                companyName: [{
                    companyName: req.body.companyName
                }],
                companyType: [{
                    companyType: req.body.companyType
                }],
                shortCode: [{
                    shortCode: req.body.shortCode
                }],
                contractPdf: [{
                    contractPdf: contractLink
                }],
                registrationNumber: [{
                    registrationNumber: req.body.registrationNumber
                }],
                taxId: [{
                    taxId: req.body.taxId
                }],
                openingBalance: [{
                    openingBalance: req.body.openingBalance
                }],
                // creditLimit: [{
                //     creditLimit: req.body.creditLimit
                // }],
                contactPerson: [{
                    contactPerson: req.body.contactPerson
                }],
                companyEmail: [{
                    companyEmail: req.body.companyEmail
                }],
                companyWebsite: [{
                    companyWebsite: req.body.companyWebsite
                }],
                billingCycle: [{
                    month: req.body.month,
                    days: req.body.days
                }],
                phoneNumber: [{
                    phoneNumber: req.body.phoneNumber
                }],
                personDesignation: [{
                    personDesignation: req.body.personDesignation
                }],
                email: [{
                    email: req.body.email
                }],
                addressLine1: [{
                    addressLine1: req.body.addressLine1
                }],
                addressLine2: [{
                    addressLine2: req.body.addressLine2
                }],
                country: [{
                    country: req.body.country
                }],
                state: [{
                    state: req.body.state
                }],
                city: [{
                    city: req.body.city
                }],
                zipCode: [{
                    zipCode: req.body.zipCode
                }],
                effectiveFrom: [{
                    effectiveFrom: req.body.effectiveFrom
                }],
                expiration: [{
                    expiration: req.body.expiration
                }],
                contractType: [{
                    contractType: req.body.contractType
                }],
                creditLimit: [{
                    creditLimit: req.body.creditLimit
                }],
                contractTerms: [{
                    contractTerms: req.body.contractTerms
                }]
            })


            // comapny ledger

            const companyData = await addCompanyRecord.save();

            const {  totalBalance, ledger  } = req.body

            const addComapnyLedger = companyLedger({

                companyId: companyData.companyId,

                propertyId: companyData.propertyId|| "",

                date : await getCurrentUTCTimestamp(),

                openingBalance : [{
                    openingBalance : companyData.openingBalance[0].openingBalance || "",
                    logId: Randomstring.generate(10)
                }],

                creditLimit: [{
                    creditLimit: companyData.creditLimit[0].creditLimit || "",
                    logId: Randomstring.generate(10)
                }],

                totalBalance: [{
                    totalBalance: totalBalance,
                    logId: Randomstring.generate(10)
                }],

                ledger: [{
                    ledger: ledger,
                    logId: Randomstring.generate(10)
                }],



            })

            await addComapnyLedger.save()

            return res.status(200).json({ message: "Company successfully added", statuscode: 200 })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}

export default addCompany;