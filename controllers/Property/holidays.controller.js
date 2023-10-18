// import Randomstring from "randomstring";
// import * as dotenv from "dotenv";
// dotenv.config();
// import holidayModel from "../../models/holidays.js";
// import userModel from '../../models/verifiedUsers.js'

// import {
//   getCurrentUTCTimestamp,
//   getCurrentLocalTimestamp,
// } from "../../helpers/helper.js";


// const postHoliday = async (req, res) => {
//   try {
//     const {
//       userId,
//       holidayId,  
//       propertyId,
//       shortCode,
//       holidayName,
//       startDate,
//       endDate,
//       createdBy,
//       createdOn,
//       modifiedOn,
//     } = req.body;

//     const authCodeValue = req.headers['authcode']

//     const findUser = await userModel.findOne({ userId })
    
//     if(!findUser){
//       return res.status(404).json({message:"user not found"})
//     }
//     const {authCode}= findUser

//     if(authCodeValue!==authCode){
//       return res.status(404).json({message:"invalid authCode"})
//     }
  
//     let userRole = findUser.role[0].role
//     const currentUTCTime = await getCurrentUTCTimestamp();
//     //create record
//     const newHoliday = new holidayModel({
//       propertyId,
//       shortCode,
//       holidayId:Randomstring.generate(8),
//       dateUTC: currentUTCTime,
//       dateLocal: getCurrentLocalTimestamp(),
//       createdBy:userRole,
//       createdOn:currentUTCTime,
//       holidayType: [
//         {
//           holidayName:holidayName,
//           startDate:startDate,
//           endDate:endDate
          
//         },
//       ],
     
//     });

//     // Save the reservation record
//     const savedReservation = await newHoliday.save();
//     return res.status(200).json({ message: "New booking Source added successfully", statuscode: 200 });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
//   }
// };



// export default postHoliday;
