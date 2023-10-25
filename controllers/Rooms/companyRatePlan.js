import companyRateModel from "../../models/companyRatePlane.js"
import randomString from "randomstring"
import verifiedUser from "../../models/verifiedUsers.js";

export const compnayRatePlan = async (req, res) => {
    try {
      const companyRate = new companyRateModel({
        compnayRatePlanId: randomString.generate(7),
        propertyId : req.body.propertyId,
        rateType:req.body.rateType,
        roomType: req.body.roomType,
       
          
            ratePlanName: [{ ratePlanName: req.body.ratePlanName }],
            shortCode: [{ shortCode: req.body.shortCode }],
            rantePlanInclusion: [
              {
                inclusionName: req.body.inclusionName,
                inclusionType: req.body.inclusionType,
                postingRule: req.body.postingRule,
                chargeRule: req.body.chargeRule,
                rate: req.body.rate,
              },
            ],
          })
  
      const result = await companyRate.save();
      console.log('Successfully updated:', result);
      res.status(200).json({ message: 'Successfully updated' });
    } catch (error) {
      console.error('Error occurred while updating:', error);
      res.status(500).json({ error: 'Error occurred while updating' });
    }
  };
  
  
  export const updateCompanyRatePlan = async (req, res) => {
    try {
        const {userId,ratePlanName, shortCode } = req.body;
        const compnayRatePlan = await companyRateModel.findOne({ compnayRatePlanId: req.body.compnayRatePlanId });

        // const findUser = await verifiedUser.findOne({ userId });
        // if (!findUser) {
        //     return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
        // }
        // const userToken = findUser.authCode;
        // // let userRole = findUser.role[0].role;

        // if (authCodeValue !== userToken) {
        //     return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
        // }



        if (ratePlanName) {
            const ratePlanNameObject = { ratePlanName: ratePlanName };
            compnayRatePlan.ratePlanName.unshift(ratePlanNameObject);
        }

        if (shortCode) {
            const shortCodeObject = { shortCode: shortCode };
            compnayRatePlan.shortCode.unshift(shortCodeObject);
        }

        const newRantePlanInclusion = {
            inclusionId: randomString.generate(7),
            inclusionName: req.body.inclusionName,
            inclusionType: req.body.inclusionType,
            postingRule: req.body.postingRule,
            chargeRule: req.body.chargeRule,
            rate: req.body.rate,
        };

        compnayRatePlan.rantePlanInclusion.unshift(newRantePlanInclusion);
        
        await compnayRatePlan.save()
       

    } catch (error) {
        console.error('Error occurred while updating:', error);
        res.status(500).json({ error: 'Error occurred while updating' });
    }
};



