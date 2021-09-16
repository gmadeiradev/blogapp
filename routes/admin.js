const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
const Category = mongoose.model("categories");

// index page
router.get("/", (req, res) => {
    res.render("admin/index");
});
// categories list
router.get("/categories", (req, res) => {
    Category.find().lean().sort({ date: "desc" }).then((categories) => {
        res.render("admin/categories", { categories: categories });
    }).catch((err) => {
        req.flash("error_msg", "Error trying to list categories!");
        console.log(err);
        res.redirect("/admin");
    });
});
// new category
router.post("/categories/new", (req, res) => {
    let error = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        error.push({ text: "Invalid Name!" });
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        error.push({ text: "Invalid Slug!" });
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
        };
        new Category(newCategory).save().then(() => {
            req.flash("success_msg", "Successfully created category!");
            res.redirect("/admin/categories");
        }).catch((err) => {
            req.flash("error_msg", "Error trying to create category! Please try again!");
            console.log(err);
            res.redirect("/admin");
        });
    }
});
// show categories by id
router.get("/categories/edit/:id", (req, res) => {
    Category.findOne({ _id: req.params.id }).lean().then((category) => {
        res.render("admin/editcategories", { category: category });
    }).catch((err) => {
        req.flash("error_msg", "This category doesn't exists! ");
        console.log(err);
        res.redirect("/admin/categories");
    });
});
// edit categories
router.post("/categories/edit", (req, res) => {
    Category.findOne({ _id: req.body.id }).then((category) => {
        //
        category.name = req.body.name;
        category.slug = req.body.slug;

        category.save().then(() => {
            req.flash("success_msg", "Successfully category edit!");
            res.redirect("/admin/categories");
        }).catch((err) => {
            req.flash("error_msg", "Error trying to edit category");
            console.log(err);
            res.redirect("/admin/categories");
        });
    }).catch((err) => {
        req.flash("error_msg", "There was an error editing the category!");
        console.log(err);
        res.redirect("/admin/categories");
    });
});
// delete category
router.post("/categories/delete", (req, res) => {
    Category.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Successfully deleted category!")
        res.redirect("/admin/categories");
    }).catch((err) => {
        req.flash("error_msg", "There was an error deleting the category!");
        console.log(err);
        res.redirect("/admin/categories");
    });
});
// add category
router.get("/categories/add", (req, res) => {
    res.render("admin/addcategories");
});
// posts page
router.get("/posts", (req, res) => {
    res.render("admin/posts");
});
// add posts
router.get("/posts/add", (req, res) => {
    Category.find().lean().then((categories) => {
        res.render("admin/addposts", { categories: categories });
    }).catch((err) => {
        req.flash("error_msg", "There was an error loading the form!");
        console.log(err);
        res.redirect("/admin");
    });
});

module.exports = router;
