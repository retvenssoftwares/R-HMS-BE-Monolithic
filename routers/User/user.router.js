import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postUser from '../../controllers/User/userController.js'
import userLogin from '../../controllers/User/userLogin.controller.js'
import editUserOnboarding from '../../controllers/User/editUserDetails.controller.js'
import verifyUser from "../../controllers/User/verifyUser.js"
import { sessionOut } from '../../controllers/User/sessionOut.js';
import { sessionIn } from '../../controllers/User/sessionIn.js';
import logoutUser from "../../controllers/User/logoutUser.js";
import logInUsers from "../../controllers/User/patchLoginUser.js";
import adminLogin from "../../controllers/User/adminLogin.controller.js"

const router = express.Router();

router.post("/api/addUser", postUser);
router.post("/api/userLogin", userLogin);
router.post("/api/adminLogin",adminLogin)
router.patch("/api/userEdit", upload.single('hotelLogo'), editUserOnboarding);
router.patch("/api/verifyUser", verifyUser)
router.patch("/api/sessionOut",sessionOut)
router.patch("/api/sessionIn",sessionIn)
router.post("/api/logout", logoutUser)
router.patch("/api/loginStatus", logInUsers)
export default router;