const { name } = require("ejs");
const User = require("../models/user");

// Controller function to render user profile
module.exports.profile = async function (req, res) {
  try {
    // Find user by ID and render their profile
    const user = await User.findById(req.params.id);

    return res.render("user_profile", {
      title: "User Profile",
      user_profile: user,
    });
  } catch (err) {
    // Handle errors if any
    console.error("Error finding user's profile:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
};

// Controller function to update user profile
module.exports.update = async function (req, res) {
  // Check if the user ID in request matches the authenticated user's ID
  if (req.params.id == req.user.id) {
    try {
      // Update the user profile with the provided data
      //  let user= await User.findByIdAndUpdate(req.params.id,req.body);
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("*****Multer error", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          // this is saving the path of uploaded file into the avatar field
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        console.log(req.file);
        req.flash("success", "User info changed successfully");
        return res.redirect("back");
      });
    } catch (err) {
      // Handle errors if any
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
    }
  } else {
    req.flash("success", err);
    // If user IDs don't match, return unauthorized status
    return res.status(401).json({
      error: "Warning! You are not authorized to update this profile",
    });
  }
};

// Controller function to render sign up page
module.exports.signUp = function (req, res) {
  // Redirect to profile if user is already authenticated
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  // Render sign up page
  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// Controller function to render sign in page
module.exports.signIn = function (req, res) {
  // Redirect to profile if user is already authenticated
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  // Render sign in page
  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// Controller function to create a new user
module.exports.create = async function (req, res) {
  // Password confirmation check
  if (req.body.password !== req.body.confirm_password) {
    console.log("Passwords do not match");
    req.flash("error", "Confirm Password does not match");
    return res.redirect("back"); // Use JSON response for potential API or SPA
  }

  // Check if user already exists with the provided email
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("Email already exists");
      req.flash("error", "Email already exists");
      return res.redirect("back"); // Use appropriate status code for conflict
    }
  } catch (err) {
    // Handle errors if any
    console.error("Error finding user:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }

  // Create new user with provided data
  try {
    const newUser = await User.create(req.body);
    console.log("User created successfully");
    req.flash("success", "Account created successfully");
    return res.redirect("/users/sign-in"); // Informative response
  } catch (err) {
    // Handle errors if any
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
};

// Controller function to create session upon sign in
module.exports.createSession = function (req, res) {
  req.flash("success", "logged in successfully");
  return res.redirect("/");
};

// Controller function to destroy session upon logout
module.exports.destroySession = function (req, res) {
  // Logout the user
  req.logout(function (err) {
    if (err) {
      console.log("Error in logging out:", err);
      return;
    }
    // Redirect to home page after logout
    req.flash("success", "Logged out successfully");
    return res.redirect("/");
  });
};
