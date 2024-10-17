const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../Models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");

// Signup
router
.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.signup));

// Login
router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true,
        passReqToCallback: true // Pass the request object to the callback
    }),
    userController.login
)
// .post( saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: '/login',
//         failureFlash: true
//     }),
//    userController.login
// )
// router.get("/signup",userController.renderSignupForm);

// Signup
// router.post("/signup", wrapAsync(userController.signup));


// Login 
// router.get("/login",userController.renderLoginForm)

// router.post("/login", saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: '/login',
//         failureFlash: true
//     }),
//    userController.login
// );
//Logout

router.get("/logout",userController.Logout);



module.exports = router;
