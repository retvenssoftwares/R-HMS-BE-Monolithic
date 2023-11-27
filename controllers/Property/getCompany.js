import * as dotenv from "dotenv";
dotenv.config();
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";
import companyModel from "../../models/company.js";
import properties from '../../models/property.js'
import ratePlan from "../../models/barRatePlan.js";
import companyRatePlanModel from "../../models/companyRatePlane.js";

const companyType = async (req, res) => {
        try{
            const { targetTimeZone, propertyId } = req.query;
            const findProperty = await properties.findOne({ propertyId });
            if (!findProperty) {
                return res.status(404).json({ message: "Please enter valid propertyId", statuscode: 404 })
            }
        if (findProperty) {
            const userCompany = await companyModel.find({ propertyId,"displayStatus.0.displayStatus":"1" }).select('propertyId companyId companyName contactPerson expiration').sort({_id:-1}).lean();
            const convertedCompany = await Promise.all(userCompany.map(async (company) => {
                const companyId = company.companyId;            
                const ratePlan = await companyRatePlanModel.countDocuments({ companyId });
            
                return {
                    ...company._doc,
                    propertyId: company.propertyId,
                    companyName: company.companyName[0].companyName || '',
                    companyId: company.companyId,
                    contactPerson: company.contactPerson[0].contactPerson || '',
                    expiration: company.expiration[0].expiration || '',
                    ratePlans: ratePlan || 0
                };
            }));
            return res.status(200).json({ data: convertedCompany, statuscode: 200 });
        } else {
            return res.status(200).json({ message: "No company found", statuscode: 200 });
        }
        }catch (error) {
            console.log(error);
        return res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};

export default companyType;
