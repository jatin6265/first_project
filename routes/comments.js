const express = require("express");

const router = express.Router();

const commentsController = require("../controllers/comments_controller");

const passport = require("../config/passport-local-strategy");

console.log("comment router loaded");

router.post("/create", passport.checkAuthentication, commentsController.create);
router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  commentsController.destroy
);
module.exports = router;
