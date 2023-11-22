import currencyModel from "../../models/superAdmin/basicCurrency.js";

const getCurrency = async (req, res) => {
  try {
    const currency = await currencyModel.find().select("-_id -__v");
    if (!currency) {
      return res.status(404)({
        message: "Currency not found",
        statuscode: 404,
      });
    } else {
      return res.status(200).json({ data: currency, statuscode: 200 });
    }
  } catch (err) {
    return res.status(500)({
      message: "internal server error",
      statuscode: 500,
    });
  }
};
export default getCurrency;
