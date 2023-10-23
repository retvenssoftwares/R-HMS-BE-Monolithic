import inclusion from "../../models/inclusion.js"
import randomString from "randomstring"

export const addInclusion = async(req,res)=>{
    const {inclusionName,defaultPostingRule,defaultChargeRule,inclusionType,defaultPrice} = req.body
    // Assuming inclusion is the name of your mongoose model
  const inclusionObj = new inclusion();
//   console.log(inclusionObj)
  const inclusionId = randomString.generate(7); // Generate inclusionId using randomstring, replace with your preferred method

  // Create an object to push into the inclusionArray
  const inclusionData = {
    inclusionId: inclusionId,
    inclusionName: inclusionName,
    defaultPostingRule: defaultPostingRule,
    defaultChargeRule: defaultChargeRule,
    inclusionType: inclusionType,
    defaultPrice: defaultPrice,
  };


  // Push the object into the inclusionArray
  inclusionObj.inclusionArray.push(inclusionData);

  try {
    await inclusionObj.save(); // Save the updated inclusion object
    return res.status(200).json({ message: 'Inclusion added successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding inclusion', error: error });
  }

    
}



export const updateInclusion = async (req, res) => {
  const { inclusionName, defaultPostingRule, defaultChargeRule, inclusionType, defaultPrice } =req.body;

  try {
    // const inclusionId = randomString.generate(7); // Generate inclusionId using randomstring, replace with your preferred method

    // Create an object to push into the inclusionArray
    const inclusionData = {
      inclusionId: req.body.inclusionId,
      inclusionName: inclusionName,
      defaultPostingRule: defaultPostingRule,
      defaultChargeRule: defaultChargeRule,
      inclusionType: inclusionType,
      defaultPrice: defaultPrice,
    };

    const inclusionObj = await inclusion.findOne({"inclusionArray.inclusionId":req.body.inclusionId}); // Assuming you want to update the first document in the collection

    // If inclusionObj exists, update the inclusionArray
    if (inclusionObj) {
      const existingArray = inclusionObj.inclusionArray;
      const newArray = [inclusionData, ...existingArray];
      inclusionObj.inclusionArray = newArray;

      await inclusionObj.save(); // Save the updated inclusion object
      return res.status(200).json({ message: 'Inclusion added successfully' });
    } else {
      return res.status(404).json({ message: 'No inclusion found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error adding inclusion', error: error });
  }
};
