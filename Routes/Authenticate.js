const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/Authentication");
const authenticate = require("../Middleware/authenticate");

router.post("/register",controllers.registerUser);
router.post("/login",controllers.login);
router.get("/validUser",authenticate,controllers.ValidUser);
router.get("/logout",authenticate,controllers.Logout);


module.exports = router;