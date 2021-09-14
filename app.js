const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
// const mongoose = require("mongoose");

// * configs
// bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//hablebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars");
// mongoose

// * public
app.use(express.static(path.join(__dirname,"public")));

// * routes
app.use("/admin", admin);

const PORT = 8081;
app.listen(PORT, () => {
    console.log("Server ON!");
});
