import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import folio from "../../models/folio.js"
import verifiedUser from "../../models/verifiedUsers.js";
import Randomstring from "randomstring";

export const addDiscount = async (req, res) => {

    const { folioNo, propertyId,userId, discountType, discountPercentage, discountAmount, narration } = req.body
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

    const totalAmount = await folio.findOne({folioNo : folioNo})


    let adjustedTotalBalance = 0;

    
    // if(totalAmount.totalBalance < 0){
    //     return res.status(200).json({message : "Your totalAmount is less than zero", statusCode:200})
    // }

    // if(totalAmount.totalBalance < discountAmount){
    //     return res.status(200).json({message : "Your discount amount in greater than totalAmount", statusCode:200})
    // }

    // if(Math.round(totalAmount.totalBalance * (discountPercentage / 100)) === 0){
    //     return res.status(200).json({message : "Your total balance is zero", statusCode:200})
    // }

    // if(totalAmount.totalBalance < Math.round(totalAmount.totalBalance * (discountPercentage / 100))){
    //     return res.status(200).json({message : "Your discount percentage in greater than totalAmount", statusCode:200})
    // }
    
    //console.log(Math.round(totalAmount.totalBalance * (discountPercentage / 100)))

    let percentageAmount = 0

    if (discountAmount) {
         adjustedTotalBalance = parseFloat(discountAmount);
    } else if (discountPercentage) {
        adjustedTotalBalance = Math.round(totalAmount.totalBalance * (discountPercentage / 100));
        percentageAmount = Math.round(totalAmount.totalBalance * (discountPercentage / 100))
        
    }

    // console.log(adjustedTotalBalance)

    const updatedPassword = await folio.updateOne(
        { folioNo: folioNo, propertyId: propertyId },
        {

            $inc: {
                totalBalance: -adjustedTotalBalance,
            },

            $push: {
                folioRecords: {
                    $each: [
                        {
                            date: new Date(),
                            refNo : Randomstring.generate({ charset: 'numeric', length: 10 }) ,
                            user : findUser.role[0].role || "",
                            discountType: discountType,
                            discountPercentage : -percentageAmount || "",
                            discountAmount : -discountAmount || "",
                            narration : narration,
                            // ... other fields from req.body
                        }
                    ],
                    $position: 0,
                },
            },
        }
    );

    if(updatedPassword){
        return res.status(200).json({message : "discountAdded added successfully", statusCode:200})
    }else{
        return res.status(404).json({message : "something wrong", statusCode:404})
    }
}