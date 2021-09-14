const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
const Category = mongoose.model("categories");

router.get("/", (req, res) => {
    res.render("admin/index");
});

router.get("/posts", (req, res) => {
    res.send("Posts page");
});

router.get("/categories", (req, res) => {
    // categories list
    Category.find().lean().sort({ date: "desc" }).then((categories) => {
        res.render("admin/categories", { categories: categories });
    }).catch((err) => {
        req.flash("error_msg", "Error trying to list categories");
        res.redirect("/admin");
    });
});

router.post("/categories/new", (req, res) => {
    let error = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        error.push({ text: "Invalid Name!" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        error.push({ text: "Invalid Slug" });
    }

    if (req.body.name.length < 2) {
        error.push({ text: "Category Name too small!" });
    }

    if (error.length > 0) {
        res.render("admin/addcategories", { error: error });
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }
        new Category(newCategory).save().then(() => {
            req.flash("success_msg", "Successfully created category!");
            res.redirect("/admin/categories");
        }).catch((err) => {
            req.flash("error_msg", "Error trying to create category! Please try again.");
            res.redirect("/admin");
        });
    }
});

router.get("/categories/add", (req, res) => {
    res.render("admin/addcategories");
});

module.exports = router;
