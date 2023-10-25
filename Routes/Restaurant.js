const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/Restaurant");
const upload = require("../multerconfig/storageConfig");
// const authenticate = require("../Middleware/authenticate");

router.post("/addFood",upload.single("placeholder"),controllers.addFood);
router.get("/foods/:id",controllers.getFoods);
router.get("/fetchSingleFoodData/:id",controllers.getSingleFoodData);
router.put("/updateFood/:id",upload.single("placeholder"),controllers.updateFood);
router.put("/updateOrderStatus/:id",controllers.updateStatusOfOrder);
router.delete("/deleteFood/:id",controllers.foodDelete);
router.get("/updateFoodStockStatus/:id",controllers.updateFoodStockStatus);
router.get("/getAllResOrder/:id",controllers.getAllOrdersData);
// router.get("/logout",authenticate,controllers.Logout);


module.exports = router;