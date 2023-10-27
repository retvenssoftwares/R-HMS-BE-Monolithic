import { verifyUser } from "../../helpers/helper.js";
import discountPlanModel from "../../models/discountPlan";
import discountPlanLogModel from "../../models/LogModels/discountPlanLogs";

const editDiscountPlan = async (req, res) => {
    try {

        const { userId, discountPlanId } = req.query
        const authCodeValue = req.headers['authcode']
        const result = await verifyUser(userId, authCodeValue)
        if (result.success) {
            const findDiscountPlan = await discountPlanModel({ discountPlanId })
            const findDiscountPlanLogs = await discountPlanLogModel({ discountPlanId })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export default editDiscountPlan;