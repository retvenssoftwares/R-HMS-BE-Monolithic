import verifiedUser from "../../models/verifiedUsers.js";

const logoutUser = async (req, res) => {
    try {
        const { userId, token } = req.body
        const findUser = await verifiedUser.findOne({ userId })
        if (!findUser || !userId) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }

        var tokenArray = findUser.token
        if (tokenArray.some((t) => t.token === token)) {
            tokenArray = tokenArray.filter((t) => t.token !== token);

            await verifiedUser.findOneAndUpdate(
                { userId },
                { $set: { token: tokenArray } },
                { new: true }
              );
            return res.status(200).json({ message: "Logged out successfully", statuscode: 200 })
        } else {
            return res.status(400).json({ message: "Invalid token entered", statuscode: 400 })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export default logoutUser