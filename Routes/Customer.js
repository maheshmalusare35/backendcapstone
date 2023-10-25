const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/Customer");
const Authcontrollers = require("../Controllers/Authentication");
// const authenticate = require("../Middleware/authenticate");

router.get("/getAllFoods",controllers.getFoods);
router.get("/getFoodByRes/:id",controllers.getFoodByRestaurant);
router.get("/getAllRestaurant",Authcontrollers.getRestaurant);
router.get("/cartFoodsData",controllers.getCartFoods);
router.post("/order",controllers.orderFoods);
router.get("/getAllOrders/:id",controllers.allOrderDataUser);
router.get("/getAllOrders2/:id",controllers.allOrderDataUser2);

// router.get("/logout",authenticate,controllers.Logout);


module.exports = router;