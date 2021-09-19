const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
const Category = mongoose.model("categories");
require("../models/Post");
const Post = mongoose.model("posts");

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
// edit categories (and display them)
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
    Post.find().lean().populate("category").sort({ data: "desc" }).then((posts) => {
        res.render("admin/posts", { posts: posts });
    }).catch((err) => {
        req.flash("error_msg", "There was an error trying to list the posts!");
        console.log(err);
        res.redirect("/admin");
    });
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
// new post
router.post("/posts/new", (req, res) => {
    let error = [];

    if (req.body.category === "0") {
        error.push({ text: "Invalid category. Register a category." });
    }
    if (error.length > 0) {
        res.render("admin/addposts", { error: error });
    } else {
        const newPost = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category,
            slug: req.body.slug
        }
        new Post(newPost).save().then(() => {
            req.flash("success_msg", "Successfully created post!");
            res.redirect("/admin/posts");
        }).catch((err) => {
            req.flash("error_msg", "There was an error to create the post!")
            console.log(err);
            res.redirect("/admin/posts");
        });
    }
});
// edit posts (and display them)
router.get("/posts/edit/:id", (req, res) => {
    Post.findOne({ _id: req.params.id }).lean().then((post) => {
        Category.find().lean().then((categories) => {
            res.render("admin/editposts", { categories: categories, post: post });
        }).catch((err) => {
            req.flash("error_msg", "There was an error to list the categories!");
            console.log(err);
            res.redirect("/admin/posts");
        });
    }).catch((err) => {
        req.flash("error_msg", "There was an error to load the edition form!")
        console.log(err);
        res.redirect("/admin/posts");
    });
});

router.post("/post/edit", (req, res) => {
    Post.findOne({ _id: req.body.id }).then((post) => {
        //
        post.title = req.body.title;
        post.slug = req.body.slug;
        post.description = req.body.description;
        post.content = req.body.content;
        post.category = req.body.category;

        post.save().then(() => {
            req.flash("success_msg", "Successfully updated post!");
            res.redirect("/admin/posts");
        }).catch((err) => {
            req.flash("error_msg", "There was an error trying to update!");
            console.log(err);
            res.redirect("/admin/posts");
        });
    }).catch((err) => {
        req.flash("error_msg", "There was an error trying to save the update!");
        console.log(err);
        res.redirect("/admin/posts");
    });
});

module.exports = router;
