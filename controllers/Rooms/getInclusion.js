import * as dotenv from "dotenv";
dotenv.config();
import  inclusionModel from "../../models/inclusion.js";
import { convertTimestampToCustomFormat,verifyUser } from "../../helpers/helper.js";


const getInclusion = async (req, res) => {
    try{
        const { targetTimeZone,userId,propertyId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await verifyUser(userId, authCodeValue);

        if(result.success){
            const inclusion = await inclusionModel.find({ propertyId : propertyId });
            
            if (inclusion.length > 0) {
                const convertedInclusion = inclusion.map(inclusion => {
                    // Convert the dateUTC to the user's time zone
                     const convertedDateUTC = convertTimestampToCustomFormat(inclusion.createdOn, targetTimeZone);
                     var convertedModifiedOn = ''
                    if (inclusion.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(inclusion.modifiedOn[0].modifiedOn, targetTimeZone);
                    }
                    
                    return {
                        ...inclusion._doc,
                   
                     createdOn: convertedDateUTC,
                     inclusionId : inclusion.inclusionId,
                     inclusionName : inclusion.inclusionName[0] || {},
                     charge : inclusion.charge[0] || {},
                     inclusionType : inclusion.inclusionType[0] || {},
                     chargeRule : inclusion.chargeRule[0] || {},
                     postingRule : inclusion.postingRule[0] || {},
                     modifiedOn : convertedModifiedOn,
                     modifiedBy : inclusion.modifiedBy[0] || {},
                     createdBy : inclusion.createdBy,
                     shortCode : inclusion.shortCode,

                    };

                });
                return res.status(200).json({ inclusion: convertedInclusion, statuscode: 200 });
            } else {
                return res.status(404).json({ error: "No inclusion found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message });
    
        }
            
    } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }

};
    

export default getInclusion;