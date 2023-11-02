import companyRateModel from "../../models/companyRatePlane.js"
import Randomstring from "randomstring"
import requestIP from "request-ip"
import verifiedUser from "../../models/verifiedUsers.js";
import { getCurrentUTCTimestamp , findUserByUserIdAndToken } from '../../helpers/helper.js'
import copmanyRatePlanLog from "../../models/LogModels/compnayRatePlanLogs.js"

export const compnayRatePlan = async (req, res) => {
    try {
  
      const {userId,propertyId, rateType , companyName ,createdBy , roomTypeId ,  shortCode , ratePlanInclusion ,ratePlanName, inclusionTotal ,ratePlanTotal , ipAddress, deviceType} = req.body
      const authCodeValue = req.headers["authcode"]
      const findUser = await verifiedUser.findOne({ userId });
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
      

        const result = await findUserByUserIdAndToken(userId, authCodeValue);
     
      let userRole = findUser.role[0].role;

      var clientIp = requestIP.getClientIp(req)

      const compnayRatePlanId = Randomstring.generate(10)
      if (result.success){
      const companyRate = new companyRateModel({
        propertyId,

        compnayRatePlanId :  compnayRatePlanId,

        rateType : rateType,
       
        companyName : companyName,

        roomTypeId: roomTypeId,

        createdBy:  userRole,

        createdOn : await getCurrentUTCTimestamp(),


        ratePlanName : [{
          ratePlanName : ratePlanName,
          logId: Randomstring.generate(10),
        }],

        shortCode :[{
          shortCode :shortCode,
          logId: Randomstring.generate(10),
        }],

        inclusionTotal :[{
          inclusionTotal :inclusionTotal,
          logId: Randomstring.generate(10),
        }],

        ratePlanTotal : [{
          ratePlanTotal : ratePlanTotal,
          logId: Randomstring.generate(10),
        }],

        ratePlanInclusion :[{
          ratePlanInclusion : ratePlanInclusion,
          logId: Randomstring.generate(10),
        }]

      })
  
      const result = await companyRate.save();


      //logs
      const companyRatePlanLogs = new copmanyRatePlanLog({
        ratePlanName:[{
          logId:result.ratePlanName[0].logId,
          ratePlanName:result.ratePlanName[0].ratePlanName,
          deviceType:deviceType,
          ipAddress : clientIp,
          userId : userId
        }],
        compnayRatePlanId: result.compnayRatePlanId,
        shortCode:[{
          logId:result.shortCode[0].logId,
          shortCode : result.shortCode[0].shortCode,
          deviceType:deviceType,
          ipAddress : clientIp,
          userId : userId
        }],
        rateType:result.rateType,
        propertyId:result.propertyId,
        roomType:result.roomType,
        ratePlanInclusion : [{
          logId:result.ratePlanInclusion[0].logId,
          ratePlanInclusion : result.ratePlanInclusion[0].ratePlanInclusion,
          deviceType:deviceType,
          ipAddress : clientIp,
          userId : userId
        }],
        inclusionTotal:[{
          logId:result.inclusionTotal[0].logId,
          inclusionTotal : result.inclusionTotal[0].inclusionTotal,
          deviceType:deviceType,
          ipAddress : clientIp,
          userId : userId
        }],
        ratePlanTotal:[{
          logId:result.ratePlanTotal[0].logId,
          ratePlanTotal : result.ratePlanTotal[0].ratePlanTotal,
          deviceType:deviceType,
          ipAddress : clientIp,
          userId : userId
        }],
        createdBy: userRole,
        createdOn: await getCurrentUTCTimestamp(),
      });
  
      await companyRatePlanLogs.save();

      // console.log('Successfully updated:', result);
      return res.status(200).json({ message: 'company Rate Plan Successfully added' , statusCode : 200 });
    }else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
  } 
    } catch (error) {
      // console.error('Error occurred while aading:', error);
      return res.status(500).json({ message: 'Internal server error' , statusCode : 500});
    }
  };
  


  


  //update company patch api
  export const updateCompanyRatePlan = async (req, res) => {
    try {
        const {userId,ratePlanName, shortCode , ratePlanInclusion , inclusionTotal,ratePlanTotal , deviceType , ipAddress} = req.body;
        const companyRatePlan = await companyRateModel.findOne({ compnayRatePlanId: req.params.compnayRatePlanId })
      
        const compnayRatePlanLogs = await copmanyRatePlanLog.findOne({ compnayRatePlanId: req.params.compnayRatePlanId });
        var clientIp = requestIP.getClientIp(req)


        const findUser = await verifiedUser.findOne({ userId });
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        }
      
        // let userRole = findUser.role[0].role;
        const authCodeValue = req.headers["authcode"]

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

          if (result.success){
         const shortcodeLog =Randomstring.generate(10)
         const ratePlanNameLog =Randomstring.generate(10)
         const ratePlanInclusionLog =Randomstring.generate(10)
         const inclusionTotalLog =Randomstring.generate(10)
         const ratePlanTotalLog =Randomstring.generate(10)


        if (ratePlanName) {
            const ratePlanNameObject = { ratePlanName: ratePlanName , logId : ratePlanNameLog, ipAddress : clientIp,deviceType : deviceType,};
            companyRatePlan.ratePlanName.unshift(ratePlanNameObject);
        }

        if (shortCode) {
            const shortCodeObject = { shortCode: shortCode , logId :shortcodeLog , ipAddress : clientIp,deviceType : deviceType,};
            companyRatePlan.shortCode.unshift(shortCodeObject);

        }

        if(ratePlanInclusion) {
          const ratePlanInclusionObject = {
            ratePlanInclusion : ratePlanInclusion,
            ipAddress : clientIp,
            deviceType : deviceType,
            logId : ratePlanInclusionLog
          }
          companyRatePlan.ratePlanInclusion.unshift(ratePlanInclusionObject);
        }

        if(inclusionTotal){
          const inclusionTotalObject = {
            inclusionTotal  : inclusionTotal,
            ipAddress : clientIp,
            deviceType : deviceType,
            logId : inclusionTotalLog
          }
          companyRatePlan.inclusionTotal.unshift(inclusionTotalObject);
        }

        if(ratePlanTotal){
          const ratePlanTotalObject = {
            ratePlanTotal : ratePlanTotal,
            ipAddress : clientIp,
            deviceType : deviceType,
            logId : ratePlanTotalLog
          }
          companyRatePlan.ratePlanTotal.unshift(ratePlanTotalObject);
        }


        const requestData = {
          body: req.body,
          // Add other request data you want to store
      };
      const requestDataString = JSON.stringify(requestData)
      const updateCompanyPlan = await companyRatePlan.save()
      

      const responseData = {
        message: res.statusMessage, // Store the response message
        statuscode: res.statusCode, // Store the response status code
        // Add other response data you want to store
    };
    const responseString = JSON.stringify(responseData)

    const currentUTCTime = await getCurrentUTCTimestamp();

    if (ratePlanName) {
      const ratePlanNameObject = { ratePlanName: ratePlanName , logId : ratePlanNameLog,  modifiedOn:currentUTCTime, userId:userId , deviveType : deviceType , ipAddress : clientIp};
      compnayRatePlanLogs.ratePlanName.unshift(ratePlanNameObject);
  }

  if (shortCode) {
      const shortCodeObject = { shortCode: shortCode , logId :shortcodeLog , modifiedOn:currentUTCTime, userId:userId , deviveType : deviceType , ipAddress : clientIp};
      compnayRatePlanLogs.shortCode.unshift(shortCodeObject);

  }

  if(ratePlanInclusion) {
    const ratePlanInclusionObject = {
      ratePlanInclusion : ratePlanInclusion,
      logId : ratePlanInclusionLog,
      modifiedOn:currentUTCTime,
      userId:userId,
      request: requestDataString,
      response: responseString,
      deviveType : deviceType , 
      ipAddress : clientIp
    }
    compnayRatePlanLogs.ratePlanInclusion.unshift(ratePlanInclusionObject);
  }

  if(inclusionTotal){
    const inclusionTotalObject = {
      inclusionTotal  : inclusionTotal,
      logId : inclusionTotalLog,
      modifiedOn:currentUTCTime,
      userId:userId,
      deviveType : deviceType , 
      ipAddress : clientIp

    }
    compnayRatePlanLogs.inclusionTotal.unshift(inclusionTotalObject);
  }

  if(ratePlanTotal){
    const ratePlanTotalObject = {
      ratePlanTotal : ratePlanTotal,
      logId : ratePlanTotalLog,
      modifiedOn:currentUTCTime,
      userId:userId,
      deviveType : deviceType , 
      ipAddress : clientIp
    }
    compnayRatePlanLogs.ratePlanTotal.unshift(ratePlanTotalObject);
  }


  await compnayRatePlanLogs.save();

 
    return res.status(200).json({ message: "company Rate plan  successfully updated", statuscode:200 });
} 
else {
  return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
} 

    } catch (error) {
       // console.error('Error occurred while updating:', error);
        return res.status(500).json({ error: 'Internal server error' , statusCode :500 });
    }
};



