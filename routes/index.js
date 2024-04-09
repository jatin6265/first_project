const express = require("express");

const router = express.Router();

const homeController = require("../controllers/home_Controller");

console.log("home router loaded");

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
// for any further routes,accessfrom here
// router.use('/routeName',require('./routerfile'));

module.exports = router;
