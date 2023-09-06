const mongoose = require("mongoose");
const randomestring = require("randomstring");

const moduleSchema = new mongoose.Schema({
    moduleId: {type: String, default: randomestring.generate(10)},
    moduleName: {type: String, default: ''},
    subModules: [{
        subModuleName: {type: String},
        subModuleId: {type: String, default: randomestring.generate(10)}
    }],
    // users: [{
    //     userId: {type: String}
    // }]
})

const moduleModel = mongoose.model('modules', moduleSchema);
module.exports = moduleModel