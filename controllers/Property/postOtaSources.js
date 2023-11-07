import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser  from "../../models/verifiedUsers.js";
import otaSourcesModel from "../../models/otaSources.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";

const postOtaSourcePlan = async (req, res) => {
    try{
        const {userId} = req.query
      const{
        propertyId,
        otaId,
        otaName
      }= req.body;
      const authCodeValue = req.headers['authcode']
      const findUser = await verifiedUser.findOne({ userId })
      if (!findUser) {
        return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
      }
      const result = await findUserByUserIdAndToken(userId, authCodeValue)
      if (result.success) {
        const newOta = new otaSourcesModel({
            propertyId,
            otaId : Randomstring.generate(8),
            otaName : [{
                otaName :  otaName,
                logId : Randomstring.generate(8)
            }],

        });
        await newOta.save();
      return res.status(200).json({ message: "New Ota sources added successfully", statuscode: 200 });

    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

    }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
      }
};

export default postOtaSourcePlan