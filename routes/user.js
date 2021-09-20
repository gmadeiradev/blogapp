const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");

router.get("/register", (req, res) => {
    res.render("users/register")
});

router.post("/register", (req, res) => {
    let error = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        error.push({ text: "Invalid Name." });
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        error.push({ text: "Invalid E-mail." });
    }
    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        error.push({ text: "Invalid Password." });
    }
    if (req.body.password.length < 4) {
        error.push({ text: "Password too small." });
    }
    if (req.body.password != req.body.password2) {
        error.push({ text: "The passwords don't match! Try again." });
    }
    if (error.length > 0) {
        res.render("users/register", { error: error })
    } else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                req.flash("error_msg", "This email already exists.")
                res.redirect("/users/register");
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            req.flash("error_msg", "There was an error trying to save User.");
                            console.log(err);
                            res.redirect("/");
                        }
                        newUser.password = hash;
                        newUser.save().then(() => {
                            req.flash("success_msg", "Successfully created user.");
                            res.redirect("/");
                        }).catch((err) => {
                            req.flash("error_msg", "There was an error trying to create User! Try again.");
                            console.log(err);
                            res.redirect("/users/register");
                        });
                    });
                });
            }
        }).catch((err) => {
            req.flash("error_msg", "There was an internal error.");
            console.log(err);
            res.render("/");
        });
    }
});

router.get("/login", (req, res) => {
    res.render("users/login")
})

module.exports = router;
