import inclusion from '../../models/inclusion.js'
import verifiedUser from '../../models/verifiedUsers.js'
 import { getCurrentUTCTimestamp,findUserByUserIdAndToken } from '../../helpers/helper.js'

const patchInclusion = async (req, res) => {
    try {
         const {userId,inclusionId} =req.query;
        const {  inclusionName,shortCode,postingRule,charge,chargeRule, inclusionType} = req.body;
        const authCodeValue = req.headers['authcode'];

        const findUser = await verifiedUser.findOne({ userId });
        
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })   
        }
        let userRole = findUser.role[0].role;
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        const currentUTCTime = await getCurrentUTCTimestamp();
   if(result.success){
        const findInclusion = await inclusion.findOne({ inclusionId : inclusionId});

        if (!findInclusion || !inclusionId) {
            return res.status(404).json({ message: "Inclusion not found", statuscode: 404 });
        }
        
        if (shortCode) {
            const shortCodeObject = {
                shortCode: shortCode
            };
            findInclusion.shortCode.unshift(shortCodeObject);
        }
        if (inclusionName) {
            const inclusionNameObject = {
                inclusionName: inclusionName
            };
            findInclusion.inclusionName.unshift(inclusionNameObject);
        }
        
        if (inclusionType) {
            const inclusionTypeObject = {
                inclusionType: inclusionType
            };
            findInclusion.inclusionType.unshift(inclusionTypeObject);
        }
        if (postingRule) {
            const postingRuleObject = {
                postingRule: postingRule
            };
            findInclusion.postingRule.unshift(postingRuleObject);
        }
        if (charge) {
            const chargeObject = {
                charge: charge
            };
            findInclusion.charge.unshift(chargeObject);
        }
        if (chargeRule) {
            const chargeRuleObject = {
                chargeRule: chargeRule
            };
            findInclusion.chargeRule.unshift(chargeRuleObject);
        }

        const modifiedByObject = {
            modifiedBy: userRole
        };

        findInclusion.modifiedBy.unshift(modifiedByObject);
        findInclusion.modifiedOn.unshift({ modifiedOn: currentUTCTime });
       
        const updatedInclusion = await findInclusion.save();

        if (updatedInclusion) {
            return res.status(200).json({ message: "Inclusion successfully updated", statuscode:200 });
        } else {
            return res.status(404).json({ message: "Inclusion not found", statuscode: 404 });
        } 

    }
    else{
        return res.status(result.statuscode).json({ message: result.message });
    }
    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode:500 });
    }
}

export default patchInclusion;