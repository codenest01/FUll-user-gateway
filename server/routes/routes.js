const express = require("express");
const router = express.Router();

const ensureAuthenticated = require("../middlewares/authMiddleware")
const dashboard_Controller = require("../controllers/dashboard_Controller")
const login_Controller = require("../controllers/loginController")
const forgotPass_controller = require("../controllers/forgotPass_controller")
const updateProfi_Controller =require("../controllers/updateProfi_Controller")
const signup_Controller = require("../controllers/signup_Controller")
const verify_acc_Controller = require("../controllers/verify_acc_Controller")
const forgot_pass_veri_otp_Controller = require("../controllers/forgot-pass-veri-otp_controller")



router.post("/signup", signup_Controller.signup)
router.post("/login", login_Controller.login)
router.post("/verify-otp", ensureAuthenticated ,verify_acc_Controller.verify)
router.post("/forgot-pass" ,forgotPass_controller.forgotpass)
router.post("/forgot-pass-verify-otp" ,ensureAuthenticated ,forgot_pass_veri_otp_Controller.forgot_pass_veri_otp)
router.post("/dashboard" ,ensureAuthenticated ,dashboard_Controller.dashboard)
router.post("/update-profile" ,ensureAuthenticated ,updateProfi_Controller.update_profile)
// router.post("/upload-images" , upload_images_Controller.uploadImages)

module.exports = router;