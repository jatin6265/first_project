const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport"); //same below as for line 8 we can also use only one line  below but name  passport below must eqal to the const name
const passportLocal = require("./config/passport-local-strategy"); // this line are to use passport.isAuthenticated or checkAuthentication
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const port = 8000;
const db = require("./config/mongoose");
const User = require("./models/user");
const MongoStore = require("connect-mongo");
const sassMiddleware=require('node-sass-middleware')
const flash=require('connect-flash');
const customMiddleware=require('./config/middleware')
// Middleware setup

app.use(sassMiddleware({ 
  src:'./assets/scss',
  dest:'./assets/css', 
  debug:true,
  outputStyle:'extended',
  prefix:'/css',

}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    name: "codeial",
    secret: process.env.SESSION_SECRET || "your_strong_secret_here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 100, // 100 minutes
      secure: false,
      httpOnly: true,
    },
    store: MongoStore.create(
      { mongoUrl: "mongodb://localhost:27017/Users", autoRemove: "disabled" },
      function (err) {
        console.log(err || "connect mongo-db setup ok");
      }
    ),  
    autoRemove: "disabled",
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Set authenticated user middleware
app.use(passport.setAuthenticateduser);
app.use(flash());
app.use(customMiddleware.setFlash)

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static assets
app.use(express.static(path.join(__dirname, "assets")));
app.use(expressLayouts);
app.set('layout','./layouts/layout')



// Routes setup
app.use("/", require("./routes"));

// Start server
app.listen(port, function (err) {
  if (err) {
    console.error(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
