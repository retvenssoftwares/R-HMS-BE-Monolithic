import currencyModel from "../../models/superAdmin/basicCurrency.js";
import Randomstring from "randomstring";

const currency = async (req, res) => {
  try {
    const basicCurrency = req.body.basicCurrency;
    if (!basicCurrency) {
      return res
        .status(404)
        .json({ message: "please enter a currency", statuscode: 404 });
    }
    if (basicCurrency) {
      const basicCurrencyId = Randomstring.generate(8);

      const newCurrency = new currencyModel({
        basicCurrency: basicCurrency,
        basicCurrencyId: basicCurrencyId,
      });

      newCurrency.save();
      return res
        .status(200)
        .json({ message: "currency added successfully", statuscode: 200 });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "internal server error", statuscode: 500 });
  }
};
export default currency;
