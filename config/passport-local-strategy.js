const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// **WARNING: Storing passwords in plain text is extremely insecure!**

// Authentication using Passport
passport.use(
  new localStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        // Find the user and establish identity (assuming plain text password)
        const user = await User.findOne({ email:email });
        if (!user || user.password != password) {
          console.log("Invalid Username/Email or password");
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        console.error("Error in finding user:", err);
        return done(err);
      }
    }
  )
);

// Serializing the user (storing user ID in the session)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserializing the user (retrieving user from ID)
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.error("Error in finding user:", err);
      return done(err);
    }
    return done(null, user);
  });
});

module.exports = passport;
