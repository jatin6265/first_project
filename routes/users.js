const express = require("express");

const router = express.Router();

const passport = require("passport");

const usersController = require("../controllers/users_controller");

console.log("users router loaded");

router.get("/profile", usersController.profile);
router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);
router.post("/create", usersController.create);
// use passport as a authentication
router.post(
  "/create-session",
  passport.authenticate('local', { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

module.exports = router;
