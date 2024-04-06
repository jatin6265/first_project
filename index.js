const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 8000;
const db = require("./config/mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// use express router
app.use("/", require("./routes"));
// to use the express layouts
app.use(expressLayouts);
// extract styles and scripts from sub pages into layouts
app.set("layout extractStyles", true);
app.set("layout extractScript", true);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static("assets"));

app.listen(port, function (err) {
  if (err) {
    // console.log("Error:", err);
    // indtead of the above we can also do it like this and its called interpolation
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
