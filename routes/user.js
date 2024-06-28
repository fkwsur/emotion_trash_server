const router = require("express").Router();
const { userController: controller } = require("../controller");

router.post("/signup", controller.SignUp);
router.get("/check/phone", controller.CheckPhone);
// router.post("/signin", controller.SignIn);
// router.post("/unregister", controller.Unregister);
// router.post("/reset/password", controller.ResetPassword);
// router.post("/update/password", controller.ChangePassword);
// router.post("/update/userinfo", controller.UpdateUserInfo);
// router.post("/auto/signin", controller.AutoSignIn);
// router.get("/issue/token", controller.IssueToken);
// router.get("/get/userinfo", controller.GetUserInfo);

module.exports = router;
