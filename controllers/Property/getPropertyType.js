const propertyType = require('../../models/Property/propertyType')

module.exports = async (req,res) =>{
    const data = await propertyType.find({})
    console.log(data)
    res.json({data})
}