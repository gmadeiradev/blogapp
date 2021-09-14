const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

// * configs
//session
app.use(session({
    secret: "nodeCourse",
    resave: true,
    saveUninitialized: true
}));

// flash
app.use(flash());

// middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

// bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//hablebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars");

// mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("MongoDB connected :D");
}).catch((err) => {
    console.log("Error trying to connect to MongoDB :( " + err);
});

// * public
app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use((req, res, next) => {
    console.log("Hi, I'm middleware!");
    next();
});

// * routes
app.use("/admin", admin);

const PORT = 8081;
app.listen(PORT, () => {
    console.log("Server ON!");
});
