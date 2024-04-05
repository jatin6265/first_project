const express = require("express");
const app = express();
const port = 8000;

app.listen("port", function (err) {
  if (err) {
    // console.log("Error:", err);
    // indtead of the above we can also do it like this and its called interpolation
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
