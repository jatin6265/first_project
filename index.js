const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Require passport-local's Strategy
const app = express();
const port = 8000;
const db = require("./config/mongoose");
const User = require("./models/user"); // Assuming you have a User model defined

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(passport.setAuthenticatedUser);
app.use(express.static("assets"));
app.use(expressLayouts);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session middleware setup
app.use(session({
  name: 'codeial',
  secret: "blahsomething",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: (1000 * 60 * 100)
  }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Configure the local strategy for Passport
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async function (email, password, done) {
  try {
    const user = await User.findOne({ email: email });
    if (!user || user.password !== password) {
      console.log("Invalid email or password");
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    console.error("Error finding user:", err);
    return done(err);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try{  
    const user=User.findById(id) ;
    return done(null, user);
  }catch{
    console.error("Error finding user:", err);
      return done(err);
  }});


// Routes setup
app.use("/", require("./routes"));

// Start server
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
