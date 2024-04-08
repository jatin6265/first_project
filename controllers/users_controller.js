const { name } = require("ejs");
const User = require("../models/user");

//  render the home page
module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
  });
};

// render the signUp page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// render the signIn page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
   }
  return res.render("user_sign_in", {
    title: "Codeial | Sign Up",
  });
};

//  get the Sign Up data
module.exports.create = async function (req, res) {
  // 1. Password Confirmation Check
  if (req.body.password !== req.body.confirm_password) {
    console.log("Passwords do not match");
    return res.redirect("back"); // Use JSON response for potential API or SPA
  }

  // 2. User Existence Check
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("Email already exists");
      return res.redirect("back"); // Use appropriate status code for conflict
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }

  // 3. User Creation with Secure Password Hashing
  try {
    // const saltRounds = 10; // Adjust salt rounds as needed
    // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // req.body.password = hashedPassword; // Replace plain text password

    const newUser = await User.create(req.body);
    console.log("User created successfully");
    return res.redirect("/users/sign-in"); // Informative response
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
};

//  Sign In  and create a session
module.exports.createSession = function (req, res) {
  return res.redirect("/");
};

// Assuming this is your logout route handler in users_controller.js

module.exports.destroySession = function(req, res) {
  // Logout the user
  req.logout(function(err) {
      if(err) {
          console.log("Error in logging out:", err);
          return;
      }
      // Redirect or respond as needed
      return res.redirect('/');
  });
};

