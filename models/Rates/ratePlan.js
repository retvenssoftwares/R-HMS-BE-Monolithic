const mongoose = require("mongoose")
const randomestring = require("randomstring");

const ratePlanSchema = new mongoose.Schema({

    ratePlanId : {type: String, default:randomestring.generate(10)},

    roomType : {type: String, default: "", required: false}, 

    roomTypeId : {type: String, default: "", required: false}, 

    rateType : {type: String, default: "", required: false},

    webDescription : {type: String, default: "", required: false},

    baseAdult : {type: String, default: "", required: false},

    baseChild : {type: String, default: "", required: false},

    maxChild : {type: String, default: "", required: false},

    maxAdult : {type: String, default: "", required: false},

    maxNight : {type: String, default: "", required: false},

    minNight : {type: String, default: "", required: false},

    inclusion : {type: String, default: "", required: false},

    rackRate : {type: String, default: "", required: false},

    extraAdultRate : {type: String, default: "", required: false},

    ratePlanSortKey : {type: String, default: "", required: false},

    publishedOnWeb : {type: String, default: "", required: false},

    photo : {type: String, default: "", required: false},

    showThisRateTypeToAllSources : {type: String, default: "", required: false},
    

})

const ratePlan = new mongoose.model("ratePlan",ratePlanSchema)
module.export = ratePlan