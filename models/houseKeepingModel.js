import mongoose from 'mongoose';
import db1 from "../db/conn.js"
const houseKeepingSchema = new mongoose.Schema({
    
    propertyId: {
        type: String,
        default: ''
    },

    staffId: {
        type: String,
        default: ''
    },

    profilePhoto: [{
        profilePhoto: {
        type: String,
        default: ''
        }, 
        logId: { type: String, default: "" }
    }],
    
    fullName: [{
        fullName: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
    }],

    gender: [{
        gender: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
    }],

    dateOfBirth: [{
        dateOfBirth: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
    }],

    phone: [{
        phone: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
    }],

    email: [{
        email: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
    }],

    address: [{
        address: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
    }],

    idType: [{
        idType: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
    }],
    
    idNumber: [{
        idNumber: {
            type: String,
            default: ''
        },
        logId: { type: String, default: "" }
    }],

    expirationDate : [{
        expirationDate : {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    docImage : [{
        docImage : {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],
    
    highestLevelOfEducation : [{
        highestLevelOfEducation : {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    gradeOrMarksAchieved : [{
        gradeOrMarksAchieved: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    passingYear : [{
        passingYear: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    instituteName : [{
        instituteName: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    bankName : [{
        bankName: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    ifscCode: [{
        ifscCode: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    accountType: [{
        accountType: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    accountNumber: [{
        accountNumber: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    nameOfEmergencyContact : [{
        nameOfEmergencyContact: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    relationWithEmergencyContact : [{
        relationWithEmergencyContact: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    emergencyContact : [{
        emergencyContact: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],
    
    jobTitle : [{
        jobTitle: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    departmentOrDivision : [{
        departmentOrDivision: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    employmentStartDate : [{
        employmentStartDate: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    employmentType : [{
        employmentType: {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    createdOn : {
        type: String,
        default: ''
    },

    createdBy : {
        type: String,
        default: ''
    },

    modifiedOn : [{
        modifiedOn : {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""}
    }],

    modifiedBy : [{
        modifiedBy : {
            type: String,
            default: ''
        },
        logId: { type: String, default: ""} 
    }],

});

const houseKeepingDetails = db1.model('houseKeeping', houseKeepingSchema);
export default houseKeepingDetails;


