import * as dotenv from "dotenv";
dotenv.config();
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";
import companyIdModel from "../../models/company.js";
import properties from '../../models/property.js'

const companyIdType = async (req, res) => {
     
    try{
        const { targetTimeZone, companyId, propertyId } = req.query;
        const findProperty = await properties.findOne({ propertyId });
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid companyId", statuscode: 404 })
        }
    if (findProperty) {
        const userCompany = await companyIdModel.findOne({ companyId }).select('propertyId companyId companyName contactPerson expiration').sort({_id:-1}).lean();
        const convertedCompanyId = userCompany.map(company => {

           
            return {
                ...company._doc,
                
                propertyId : company.propertyId,
                companyName: company.companyName[0].companyName || '',
                companyId : company.companyId,
                contactPerson : company.contactPerson[0].contactPerson || '',
                expiration : company.expiration[0].expiration || '',
                
            };
        });
        return res.status(200).json({ data: convertedCompanyId, statuscode: 200 })
    } else {
        return res.status(200).json({ message: "No company found", statuscode: 200 });
    }
    }catch (error) {
        console.log(error);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
}
};

export default companyIdType;


