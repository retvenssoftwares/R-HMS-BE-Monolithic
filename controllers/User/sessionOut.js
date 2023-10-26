import verifiedUser from "../../models/verifiedUsers"

export const sessionOut = async (req, res) => {
    try {
      const { userId, token, deviceType } = req.body;
      const data = await verifiedUser.findOne({ userId });
  
      let tokenArray = data.token;
  
      if (tokenArray.some((t) => t.token === token)) {
        tokenArray = tokenArray.filter((t) => t.token !== token);
  
        await verifiedUser.findOneAndUpdate(
          { userId },
          { $set: { token: tokenArray } },
          { new: true }
        );
  
        return res.status(200).json({ message: "Your session timed out" });
      } else {
        return res.status(200).json({ message: "Token not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  