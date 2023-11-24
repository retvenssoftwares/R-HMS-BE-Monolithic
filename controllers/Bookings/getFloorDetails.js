import floorDetailModel from '../../models/floor.js';
import { findUserByUserIdAndToken } from '../../helpers/helper.js';
import verifiedUser from '../../models/verifiedUsers.js'

const getFloorDetails = async (req, res) => {
     try{
        const {propertyId, userId} = req.query
        const authCodeValue = req.headers['authcode']
        const findUser=await verifiedUser.findOne({userId})
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        
        if(!findUser){
        return res.status(400).json({ message: "Please enter valid userId", statuscode: 400 })
         }
         if(result.success) {
        const findFloorDetails = await floorDetailModel.find({propertyId: propertyId});
        // console.log('findFloorDetails');
        if (!findFloorDetails) {
            
                return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 })
            }
            if (findFloorDetails.length > 0) {
                const mappedFloorDetail = findFloorDetails.map((floor) => {
                    return {
                        ...floor._doc,
                        propertyId: floor.propertyId || '',
                        floorInHotel: floor.floorInHotel[0].floorInHotel || '',
                        floorCountStart: floor.floorCountStart[0].floorCountStart || '',
                        floorDetails: floor.floorDetails.length > 0 ? floor.floorDetails: ''
                        
                    }
                })
                return res.status(200).json({ data: mappedFloorDetail, statuscode: 200 })
            } else {
                return res.status(200).json({ message: "No floor Details found", statuscode: 200 })
            }

        }else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
     }catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", statuscode: 500 });
    }
};
export default getFloorDetails;