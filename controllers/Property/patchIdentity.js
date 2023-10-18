import identityTypeModel from '../../models/identityTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'

const patchIdentityType = async (req, res) => {
    
    try{
         const { userId , shortCode , identityName , identityType ,modifiedBy , modifiedOn } = req.body;
         const identityTypeId = req.params.identityTypeId;
         const authCodeValue = req.headers['authcode'];
         const findUser = await verifiedUser.findOne({ userId });
        
        const {authCode}=findUser
         let userRole = findUser.role[0].role;

         if (authCodeValue !== authCode) {
            return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
        }

        const findIdentityType = await identityTypeModel.findOne({identityTypeId: identityTypeId });

        if (!findIdentityType || !identityTypeId) {
            return res.status(404).json({ message: "identity type not found", statuscode: 404 });
        }
    
        if (shortCode) {
            findIdentityType.shortCode = shortCode;
        }
        const currentUTCTime = await getCurrentUTCTimestamp();
        
        if (identityName) {
            const identityNameObject = [{
                identityName: identityName
            }];
            findIdentityType.identityName.unshift(identityNameObject);
        }

        if (identityType) {
            const identityTypeObject = {
                identityType : identityType
            };
            findIdentityType.identityType.unshift(identityTypeObject);
        }

        const modifiedByObject = {
            modifiedBy: userRole
        };

        findIdentityType.modifiedBy.unshift(modifiedByObject);
        findIdentityType.modifiedOn.unshift({ modifiedOn: currentUTCTime });

        const updatedIdentityType = await findIdentityType.save();

        if (updatedIdentityType) {
            return res.status(200).json({ message: "identity type successfully updated" });
        } else {
            return res.status(404).json({ message: "identity not found" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default patchIdentityType;