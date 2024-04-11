const express = require("express");

const router = express.Router();

const passport = require("../config/passport-local-strategy");

const usersController = require("../controllers/users_controller");
const postsController=require('../controllers/posts_controller')
console.log("users router loaded");
router.get('/uplod-post',passport.checkAuthentication,postsController.uploadPost)
router.get("/profile/:id", passport.checkAuthentication, usersController.profile);
router.post("/update/:id", passport.checkAuthentication, usersController.update);
router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);
router.post("/create", usersController.create);
// use passport as a authentication
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get('/sign-out',usersController.destroySession);

module.exports = router;
