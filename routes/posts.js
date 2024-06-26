const express = require("express");

const router = express.Router();

const postsController = require("../controllers/posts_controller");

const passport = require("../config/passport-local-strategy");

console.log("posts router loaded");

router.post("/create", passport.checkAuthentication, postsController.create);
router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  postsController.destroy
);
module.exports = router;
