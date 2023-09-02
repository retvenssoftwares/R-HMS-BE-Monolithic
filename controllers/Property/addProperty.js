//import model
const propertyModel = require('../../models/Property/propertySetupModel')

//export module
module.exports = async (req, res) => {
    try {
        //add fields
        const userId = req.params.userId
        const {
            registrationId,
            propertySortKey,
            propertyName,
            propertyWebsiteLink,
            propertyAddress,
            propertyLocation,
            propertyBasicCurrency,
            propertyStarCategory
        } = req.body

        if(!registrationId){
            return res.status(400).json({message: 'Invalid request'})
        }

        //create record
        const addProperty =new propertyModel({
            userId,
            propertySortKey: propertySortKey,
            propertyName: propertyName,
            propertyWebsiteLink: propertyWebsiteLink,
            propertyAddress: propertyAddress,
            propertyLocation: propertyLocation,
            propertyBasicCurrency: propertyBasicCurrency,
            propertyStarCategory: propertyStarCategory
        });

        //save record
        await addProperty.save();

//catch error
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}