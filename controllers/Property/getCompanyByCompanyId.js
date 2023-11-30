import * as dotenv from "dotenv";
dotenv.config();
import { convertTimestampToCustomFormat , findUserByUserIdAndToken} from "../../helpers/helper.js";
import companyIdModel from "../../models/company.js";
import properties from '../../models/property.js'

const fetchCompanyDetails = async (req, res) => {
     
    try{
        const {companyId, propertyId, userId} = req.query;
        const authCodeValue = req.headers['authcode']
        const findProperty = await properties.findOne({ propertyId });
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid propertyId", statuscode: 404 })
        }
        const findCompany = await companyIdModel.findOne({ companyId });
        if (!findCompany) {
            return res.status(404).json({ message: "Please enter valid companyId", statuscode: 404 })
        }
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (result.success) {
    if (findProperty ) {
                const userCompanys = await companyIdModel.find({companyId,"displayStatus.0.displayStatus":"1"}).select('propertyId effectiveFrom zipCode contractTerms city state country addressLine2 addressLine1 contractPdf personDesignation phoneNumber billingCycle creditLimit openingBalance personEmail taxId registrationNumber shortCode companyWebsite companyEmail companyLogo companyId companyName contactPerson expiration accountType').sort({_id:-1}).lean();
        const convertedCompanyId = userCompanys.map(company => {
        
            return {
                ...company._doc,
                
                propertyId : company.propertyId,
                companyName: company.companyName[0]?.companyName || '',
                companyId : company.companyId,
                accountType:company.accountType[0]?.accountType || '',
                personEmail:company.personEmail[0]?.personEmail || '',
                contractTerms:company.contractTerms[0]?.contractTerms || '',
                contactPerson : company.contactPerson[0]?.contactPerson || '',
                expiration : company.expiration[0]?.expiration || '',
                companyLogo : company.companyLogo[0]?.companyLogo || '',
                companyEmail : company.companyEmail[0]?.companyEmail || '',
                companyWebsite : company.companyWebsite[0]?.companyWebsite || '',
                shortCode : company.shortCode[0]?.shortCode || '',
                registrationNumber : company.registrationNumber[0]?.registrationNumber || '',
                taxId : company.taxId[0]?.taxId || '',
                openingBalance : company.openingBalance[0]?.openingBalance || '',
                creditLimit : company.creditLimit[0]?.creditLimit || '',
                days : company.billingCycle[0]?.days || '',
                month : company.billingCycle[0]?.month || '',
                phoneNumber : company.phoneNumber[0]?.phoneNumber || '',
                personDesignation : company.personDesignation[0]?.personDesignation || '',
                contractPdf : company.contractPdf[0]?.contractPdf || '',
                addressLine1 : company.addressLine1[0]?.addressLine1 || '',
                addressLine2 : company.addressLine2[0]?.addressLine2 || '',
                country : company.country[0]?.country || '',
                state : company.state[0]?.state || '',
                city : company.city[0]?.city || '',
                zipCode : company.zipCode[0]?.zipCode || '',
                effectiveFrom : company.effectiveFrom[0]?.effectiveFrom || ''   
                
            };
        });
        return res.status(200).json({ data: convertedCompanyId, statuscode: 200 })
    } else {
        return res.status(200).json({ message: "No company found", statuscode: 200 });
    }
   } else {
    return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
   }  
    }catch (error) {
        console.log(error);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
}
};

export default fetchCompanyDetails;


