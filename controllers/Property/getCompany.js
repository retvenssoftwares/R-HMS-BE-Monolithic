import * as dotenv from "dotenv";
dotenv.config();
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";
import companyModel from "../../models/company.js";


const companyType = async (req, res) => {
        try{
            const { targetTimeZone, propertyId } = req.query;

        const userCompany = await companyModel.find({ propertyId }).select('propertyId companyId companyName contactPerson expiration').lean();
        if (userCompany.length > 0) {
            const convertedCompany = userCompany.map(company => {
                // Convert the dateUTC to the user's time zone
                // const convertedDateUTC = convertTimestampToCustomFormat(company.createdOn, targetTimeZone);
                // const convertedModifiedOn = convertTimestampToCustomFormat(company.modifiedOn[0].modifiedOn, targetTimeZone);
                return {
                    ...company._doc,
                    
                    propertyId : company.propertyId,
                    companyName: company.companyName[0] || '',
                    companyId : company.companyId,
                    contactPerson : company.contactPerson[0] || '',
                    expiration : company.expiration[0] || '',
                    
                };

            });

            return res.status(200).json({ userCompany: convertedCompany, statuscode: 200 });
        } else {
            return res.status(404).json({ message: "No company found", statuscode: 404 });
        }

        }catch (error) {
            console.log(error);
        return res.status(500).json({ message: error.message, statusCode: 500 });
    }
};

export default companyType;
