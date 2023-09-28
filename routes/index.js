const express = require("express");

const router = express.Router();

const homeController = require("../controllers/home_controller");

router.get("/",homeController.home);
router.use("/users",require("./usrers"));
router.use("/posts",require('./posts'));
router.use("/comments",require('./comments'));
router.use('/likes',require('./likes'));
//for any further routes, access from home
//router.use("/routerName",require("./routerFilePath"));

router.use('/api',require('./api'));

console.log("Router loaded");

module.exports = router;