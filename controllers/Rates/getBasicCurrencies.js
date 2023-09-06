const basicCurrencyModel = require('../../models/Rates/basicCurrencies')

module.exports = async (req, res) => {
    const getBasicCurrencies = basicCurrencyModel.find({});
    if(!getBasicCurrencies){
        return res.status(404).json({message: "No basic currencies found"});
    }else{
        res.status(200).json([getBasicCurrencies])
    }
}