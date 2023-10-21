import Randomstring from "randomstring";
import company from "../../models/company.js";
import { uploadImageToS3, verifyUser } from "../../helpers/helper.js";

const addCompany = async (req, res) => {
    try {
        const { userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await verifyUser(userId, authCodeValue);
        if (result.success) {
            var imageUrl = ""
            if (req.file) {
                imageUrl = await uploadImageToS3(req.file)
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
                registrationNumber: [{
                    registrationNumber: req.body.registrationNumber
                }],
                taxId: [{
                    taxId: req.body.taxId
                }],
                openingBalance: [{
                    openingBalance: req.body.openingBalance
                }],
                creditLimit: [{
                    creditLimit: req.body.creditLimit
                }],
                billingPreference: [
                    {
                        billingPreference: req.body.billingPreference
                    }
                ],
                contactPerson: [{
                    contactPerson: req.body.contactPerson
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

            addCompanyRecord.save();
            return res.status(200).json({ message: "Company successfully added", statuscode: 200 })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error" })
    }

}

export default addCompany;