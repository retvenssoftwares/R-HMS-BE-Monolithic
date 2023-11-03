import express from 'express';
const router = express.Router();
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//postingRule
import postingRules from "../../controllers/superAdmin/postPostingRules.js"
import postingRule from "../../controllers/superAdmin/getPostingRules.js"

//chargeRule
import chargeRules from "../../controllers/superAdmin/postChargeRules.js"
import chargeRule from "../../controllers/superAdmin/getChargeRules.js"

//bedType
import bedTypes from "../../controllers/superAdmin/postBedType.js"
import bedTypeRule from "../../controllers/superAdmin/getBedType.js"

//inclusionType
import inclusionTypes from "../../controllers/superAdmin/postInclusionType.js"
import inclusionTypesRule from "../../controllers/superAdmin/getInclusionType.js"

//accountType
import accountTypes from "../../controllers/superAdmin/postAccountType.js"
import accountTypesMethod from "../../controllers/superAdmin/getAccountType.js"

//PropertyRating
import postRating from '../../controllers/superAdmin/postPropertyRating.js'
import getRating from '../../controllers/superAdmin/getPropertyRating.js'

//PropertyType
import postPropertyType from '../../controllers/superAdmin/postPropertyType.js'
import getPropertyType from '../../controllers/superAdmin/getPropertyType.js'

//Desgnation
import designation from '../../controllers/superAdmin/postDesignation.js'
import getDesignation from '../../controllers/superAdmin/getDesignation.js'

//AmenityType
import postAmenityType from '../../controllers/superAdmin/postAmenityType.js'
import getAmenityType from '../../controllers/superAdmin/getAmenityType.js'

//AmenityIcon
import postAmenityIcon from '../../controllers/superAdmin/postAmenityIcon.js'
import getAmenityIcon from '../../controllers/superAdmin/getAmenityIcon.js'


////////////////////////////////////////////////////
//bedType
router.post("/api/bedType", bedTypes);
router.get("/api/getBedType", bedTypeRule);

//posting 
router.post("/api/postingRule", postingRules);
router.get("/api/postingRulesModels", postingRule);


//charge
router.post("/api/chargeRule", chargeRules );
router.get("/api/getchargeRule", chargeRule);

//inclusionType
router.post("/api/inclusionType", inclusionTypes);
router.get("/api/getInclusionType", inclusionTypesRule);

//accountType
router.post("/api/postAccountType", accountTypes);
router.get("/api/getAccountType", accountTypesMethod);

//propertyRating
router.post("/api/postRating",postRating)
router.get("/api/getRating",getRating)

//PropertyType
router.post("/api/postPropertyType",postPropertyType)
router.get("/api/getPropertyType",getPropertyType)

//designation
router.post("/api/postDesignation",designation)
router.get("/api/getDesignation",getDesignation)

//Amenitytype
router.post("/api/postAmenityType",postAmenityType)
router.get("/api/getAmenityType",getAmenityType)

//AmenityIcon
router.post("/api/postAmenityIcon",upload.fields([{ name: "amenityIcon", maxCount: 1 }]),postAmenityIcon)
router.get("/api/getAmenityIcon",getAmenityIcon)

export default router;