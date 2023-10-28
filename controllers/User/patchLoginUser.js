import loginUserModel from "../../models/verifiedUsers.js"

const loginUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "Invalid userId", statuscode: 400 });
    }

    const findUser = await loginUserModel.findOne({ userId });
    if (!findUser) {
      return res.status(404).json({ message: "User not found", statuscode: 404 });
    }

    // Check if the isLogin field is already true
    if (findUser.isLogin === "true") {
      return res.status(200).json({   message: "isLogin is already true",statuscode: 200 });
    }

    // Update the isLogin field to "true"
    const updateResult = await loginUserModel.updateOne({ userId: userId }, { $set: { isLogin: "true" }});

  
      return res.status(200).json({ isLogin: "true",propertyType:findUser.propertyTypeSOC, statuscode: 200 });
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default loginUser;
