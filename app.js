const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Post");
const Post = mongoose.model("posts");

// * configs
//session
app.use(session({
    secret: "nodeCourse",
    resave: true,
    saveUninitialized: true
}));

// flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

// express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
app.get("/", (req, res) => {
    Post.find().populate("category").sort({ date: "desc" }).then((posts) => {
        res.render("index", { posts: posts });
    }).catch((err) => {
        req.flash("error_msg", "There was an internal error!");
        console.log(err);
        res.redirect("/404");
    })
});

app.get("/404", (req, res) => {
    res.send("ERROR 404!");
});

app.use("/admin", admin);

const PORT = 8081;
app.listen(PORT, () => {
    console.log("Server ON!");
});
