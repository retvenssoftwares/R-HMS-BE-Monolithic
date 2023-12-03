import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import folio from "../../models/folio.js"
import verifiedUser from "../../models/verifiedUsers.js";
import Randomstring from "randomstring";

export const addCharges = async (req, res) => {

    const { folioNo, propertyId,userId, chagreType, chargeRule, rate, totalCharges, quantity, narration } = req.body
    const findUser = await verifiedUser.findOne({ userId: userId });

    if (!findUser) {
      return res
        .status(404)
        .json({ message: "User not found or invalid userid", statuscode: 404 });
    }
    const authCodeValue = req.headers["authcode"];

    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if(!result.success){
        return res.status(404).json({message: " Invalid Token", statusCode : 404})
    }

    const adjustedAmount = parseFloat(totalCharges);

    const updatedPassword = await folio.updateOne(
        { folioNo: folioNo, propertyId: propertyId },
        {
            $inc: { 
                totalBalance: adjustedAmount,
            },

            $push: {
                folioRecords : {
                    $each: [
                        {
                            date: new Date(),
                            refNo : Randomstring.generate({ charset: 'numeric', length: 10 }) ,
                            user : findUser.role[0].role || "",
                            chagreType: chagreType,
                            chargeRule : chargeRule,
                            rate : rate,
                            totalCharges : totalCharges,
                            quantity :  quantity,
                            narration : narration,
                            logId : Randomstring.generate(10)
                            // ... other fields from req.body
                        }
                    ],
                    $position: 0,
                },
            },
        }
    );

    if(updatedPassword){
        return res.status(200).json({message : "charges added successfully", statusCode:200})
    }else{
        return res.status(404).json({message : "something wrong", statusCode:404})
    }
}