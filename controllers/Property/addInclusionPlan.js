
import addInclusionPlanModel from "../../models/inclusionPlan.js";
import inclusion from "../../models/inclusion.js";
import randomString from "randomstring";

export const addInclusionPlan = async (req, res) => {
  try {
    const inclusionIds = req.body.inclusionIds; // Assuming the request body has an array of inclusionIds

    const inclusionData = await inclusion.find({
      "inclusionArray.inclusionId": { $in: inclusionIds },
    });

    const inclusionPlanArray = inclusionData.map((item) => {
      const inclusionObj = item.inclusionArray.find((subItem) =>
        inclusionIds.includes(subItem.inclusionId)
      );

      if (inclusionObj) {

        const inclusionPlanObj = {
          inclusionId: inclusionObj.inclusionId,
          inclusionName: inclusionObj.inclusionName,
          postingRule: inclusionObj.defaultPostingRule,
          chargeRule: inclusionObj.defaultChargeRule,
          inclusionType: inclusionObj.inclusionType,
          price: inclusionObj.defaultPrice,
          
        };
        return inclusionPlanObj;
      }
    });

    // console.log(inclusionPlanArray);

    const newInclusionPlanModel = new addInclusionPlanModel({
      inclusionPlanName: req.body.inclusionPlanName,
      shortCode: req.body.shortCode,
      inclusionPlaneId: randomString.generate(7),
      inclusionPlanNameArray: [inclusionPlanArray],
    });

    await newInclusionPlanModel.save();
    console.log("Inclusion Plan added successfully");
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ message: "Error fetching inclusion IDs", error: error });
  }
};



export const updateInclusionPlan = async (req, res) => {
  try {
    const inclusionPlanObj = {
      inclusionId: req.body.inclusionId,
      inclusionName: req.body.inclusionName,
      postingRule: req.body.postingRule,
      chargeRule: req.body.chargeRule,
      inclusionType: req.body.inclusionType,
      price: req.body.price,
    };

    const existingInclusionPlan = await addInclusionPlanModel.findOne({
      inclusionPlanName: req.body.inclusionPlanName,
    });

    if (!existingInclusionPlan) {
      return res
        .status(404)
        .json({ message: "Inclusion Plan not found with provided name" });
    }

    const existingArray = existingInclusionPlan.inclusionPlanNameArray[0] || [];

    const newArray = [inclusionPlanObj, ...existingArray];
    const finalArray = [newArray, ...existingInclusionPlan.inclusionPlanNameArray];

    existingInclusionPlan.inclusionPlanNameArray = finalArray;

    await existingInclusionPlan.save();
    console.log("Inclusion Plan updated successfully");
    res.status(200).json({ message: "Inclusion Plan updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating inclusion plan", error: error });
  }
};
