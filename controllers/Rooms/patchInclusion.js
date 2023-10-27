import inclusion from '../../models/inclusion.js'
import verifiedUser from '../../models/verifiedUsers.js'
// import { getCurrentUTCTimestamp } from '../../helpers/helper.js'

const patchInclusion = async (req, res) => {
    try {

        const { userId, inclusionName, inclusionType, inclusionId} = req.query;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });
        
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })   
        }
        const userToken = findUser.authCode;
        //  let userRole = findUser.role[0].role;

        if (authCodeValue !== userToken) {
            return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
        }

        const findInclusion = await inclusion.findOne({ inclusionId : inclusionId});

        if (!findInclusion || !inclusionId) {
            return res.status(404).json({ message: "Inclusion not found", statuscode: 404 });
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
       
        const updatedInclusion = await findInclusion.save();

        if (updatedInclusion) {
            return res.status(200).json({ message: "Inclusion successfully updated", statuscode:200 });
        } else {
            return res.status(404).json({ message: "Inclusion not found", statuscode: 404 });
        } 
    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode:500 });
    }
}

export default patchInclusion;