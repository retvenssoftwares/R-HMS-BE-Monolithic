import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postUser from '../../controllers/User/userController.js'
import userLogin from '../../controllers/User/userLogin.controller.js'
import editUserOnboarding from '../../controllers/User/editUserDetails.controller.js'

const router = express.Router();

router.post("/api/addUser", postUser);
router.post("/api/userLogin", userLogin);
router.patch("/api/userEdit", upload.single('hotelLogo'), editUserOnboarding);

export default router;