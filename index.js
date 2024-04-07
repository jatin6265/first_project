const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("./config/passport-local-strategy");
const LocalStrategy = require("passport-local").Strategy; // Require passport-local's Strategy
const app = express();
const port = 8000;
const db = require("./config/mongoose");
const User = require("./models/user"); // Assuming you have a User model defined

// Middleware setup (adjusted for performance and security)
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser()); // Parse cookies before session management
app.use(
  session({
    name: "codeial",
    secret: process.env.SESSION_SECRET || "your_strong_secret_here", // Use environment variable for security
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 100, // 100 minutes
      secure: false, // Set to true for HTTPS
      httpOnly: true,
    },
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Set authenticated user (custom middleware for security)
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

// Serve static assets
app.use(express.static(path.join(__dirname, "assets")));
app.use(expressLayouts);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes setup
app.use("/", require("./routes"));

// Start server
app.listen(port, function (err) {
  if (err) {
    console.error(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
