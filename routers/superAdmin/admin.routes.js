import express from "express";
const router = express.Router();
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//postingRule
import postingRules from "../../controllers/superAdmin/postPostingRules.js";
import postingRule from "../../controllers/superAdmin/getPostingRules.js";

//chargeRule
import chargeRules from "../../controllers/superAdmin/postChargeRules.js";
import chargeRule from "../../controllers/superAdmin/getChargeRules.js";

//bedType
import bedTypes from "../../controllers/superAdmin/postBedType.js";
import bedTypeRule from "../../controllers/superAdmin/getBedType.js";

//inclusionType
import inclusionTypes from "../../controllers/superAdmin/postInclusionType.js";
import inclusionTypesRule from "../../controllers/superAdmin/getInclusionType.js";

//accountType
import accountTypes from "../../controllers/superAdmin/postAccountType.js";
import accountTypesMethod from "../../controllers/superAdmin/getAccountType.js";

//PropertyRating
import postRating from "../../controllers/superAdmin/postPropertyRating.js";
import getRating from "../../controllers/superAdmin/getPropertyRating.js";

//PropertyType
import postPropertyType from "../../controllers/superAdmin/postPropertyType.js";
import getPropertyType from "../../controllers/superAdmin/getPropertyType.js";

//Desgnation
import designation from "../../controllers/superAdmin/postDesignation.js";
import getDesignation from "../../controllers/superAdmin/getDesignation.js";

//AmenityType
import postAmenityType from "../../controllers/superAdmin/postAmenityType.js";
import getAmenityType from "../../controllers/superAdmin/getAmenityType.js";

//AmenityIcon
import postAmenityIcon from "../../controllers/superAdmin/postAmenityIcon.js";
import getAmenityIcon from "../../controllers/superAdmin/getAmenityIcon.js";

//postAmenity
import postAmenity from "../../controllers/superAdmin/createAmenity.js";
import getAmenity from "../../controllers/superAdmin/getAmenity.js";
import fetchRoomAmenity from '../../controllers/superAdmin/getRoomsAmenity.js'

//RateType
import postRateType from "../../controllers/superAdmin/postRateTypeName.js";
import getRateType from "../../controllers/superAdmin/getRateTypeName.js";

// OTA
import { newOta } from "../../controllers/superAdmin/otaPost.js";
import getOta from "../../controllers/superAdmin/otaGet.js";
import otaPatch from "../../controllers/superAdmin/otaPatch.js";
import fetchActiveOta from "../../controllers/superAdmin/getActiveOta.js"

//post basic Currency
import currency from "../../controllers/superAdmin/basicCurrency.js"
router.post("/api/basicCurrency",currency)

//get basic Currency
import getCurrency from "../../controllers/superAdmin/getBasicCurrency.js";
router.get("/api/getCurrency",getCurrency)


//ratesAndRestrictions
import rate from "../../controllers/superAdmin/ratesAndRestrictions.js";
router.post("/api/rateAndRestrictions",rate);

// get rate name
import rateName from "../../controllers/superAdmin/getRateAndRestrictions.js";

//department
import addDepartment from "../../controllers/superAdmin/postDepartment.js";
import fetchDepartment from "../../controllers/superAdmin/getDepartment.js";
import patchDepartmentType from "../../controllers/superAdmin/patchDepartment.js";

//employment
import addEmploymentType from "../../controllers/superAdmin/postEmploymentType.js";
import fetchEmploymentType from "../../controllers/superAdmin/getEmploymentType.js";
import updateEmploymentType from "../../controllers/superAdmin/patchEmploymentType.js";

//idType
import addIdType from "../../controllers/superAdmin/postIdType.js";
import fetchIdType from "../../controllers/superAdmin/getIdType.js";
import patchIdModel from "../../controllers/superAdmin/patchIdType.js";


router.get("/api/rateName", rateName);

////////////////////////////////////////////////////
//bedType
router.post("/api/bedType", bedTypes);
router.get("/api/getBedType", bedTypeRule);

//posting
router.post("/api/postingRule", postingRules);
router.get("/api/postingRulesModels", postingRule);

//charge
router.post("/api/chargeRule", chargeRules);
router.get("/api/getchargeRule", chargeRule);

//inclusionType
router.post("/api/inclusionType", inclusionTypes);
router.get("/api/getInclusionType", inclusionTypesRule);

//accountType
router.post("/api/postAccountType", accountTypes);
router.get("/api/getAccountType", accountTypesMethod);

//propertyRating
router.post("/api/postRating", postRating);
router.get("/api/getRating", getRating);

//PropertyType
router.post("/api/postPropertyType", postPropertyType);
router.get("/api/getPropertyType", getPropertyType);

//designation
router.post("/api/postDesignation", designation);
router.get("/api/getDesignation", getDesignation);

//Amenitytype
router.post("/api/postAmenityType", postAmenityType);
router.get("/api/getAmenityType", getAmenityType);
router.get("/api/getRoomAmenity",fetchRoomAmenity)

//AmenityIcon
router.post(
  "/api/postAmenityIcon",
  upload.fields([{ name: "amenityIcon", maxCount: 1 }]),
  postAmenityIcon
);
router.get("/api/getAmenityIcon", getAmenityIcon);

//getAmenity
router.post("/api/createAmenity",upload.fields([{ name: "amenityIcon", maxCount: 1 }]) ,postAmenity)
router.get("/api/getAmenity",getAmenity)

//rateType
router.post("/api/postRateType", postRateType);
router.get("/api/getRateTypeName", getRateType);



//OTA
router.post("/api/newOta",upload.fields([{ name: "otaLogo", maxCount: 1 }]),newOta);
router.get("/api/getUpComingOta", getOta);
router.patch("/api/patchOta",otaPatch);
router.get("/api/getActiveOta",fetchActiveOta)

//department
router.post("/api/departmentType", addDepartment)
router.get("/api/getDepartmentRule", fetchDepartment)
router.patch("/api/patchDepartment", patchDepartmentType)

//employment
router.post("/api/employmentType", addEmploymentType)
router.get("/api/getEmploymentType", fetchEmploymentType)
router.patch("/api/employmentType", updateEmploymentType)

//idType
router.post("/api/idType", addIdType)
router.get("/api/getIdType", fetchIdType)
router.patch("/api/patchIdType", patchIdModel)
export default router;
