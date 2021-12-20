const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Post");
const Post = mongoose.model("posts");
require("./models/Category");
const Category = mongoose.model("categories");
const users = require("./routes/user");
const passport = require("passport");
require("./config/auth")(passport);
const db = require("./config/db")

// * configs
//session
app.use(session({
    secret: "nodeCourse",
    resave: true,
    saveUninitialized: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    // 
    res.locals.user = req.user || null;
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
mongoose.connect(db.mongoURI).then(() => {
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
    Post.find().lean().populate("category").sort({ date: "desc" }).then((posts) => {
        res.render("index", { posts: posts });
    }).catch((err) => {
        req.flash("error_msg", "There was an internal error!");
        console.log(err);
        res.redirect("/404");
    })
});

app.get("/post/:slug", (req, res) => {
    Post.findOne({ slug: req.params.slug }).lean().then((post) => {
        if (post) {
            res.render("post/index", { post: post });
        } else {
            req.flash("error_msg", "This post doesn't exists.");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "There was an internal error!");
        console.log(err);
        res.redirect("/");
    });
});

app.get("/categories", (req, res) => {
    Category.find().lean().then((categories) => {
        res.render("categories/index", { categories: categories });
    }).catch((err) => {
        req.flash("error_msg", "There was an error trying to list categories!");
        console.log(err);
        res.redirect("/");
    });
});

app.get("/categories/:slug", (req, res) => {
    Category.findOne({ slug: req.params.slug }).lean().then((category) => {
        if (category) {
            Post.find({ category: category._id }).lean().then((posts) => {
                res.render("categories/posts", { posts: posts, category: category });
            }).catch((err) => {
                req.flash("error_msg", "There was an error trying to list the posts.");
                console.log(err);
                res.redirect("/");
            });
        } else {
            req.flash("error_msg", "This category doesn't exists.");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "An error occurred while trying to access this category's page!");
        console.log(err);
        res.redirect("/");
    });
});

app.get("/404", (req, res) => {
    res.send("ERROR 404!");
});

app.use("/admin", admin);
app.use("/users", users);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log("Server ON!");
});
