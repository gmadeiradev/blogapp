const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("../models/User");
const User = mongoose.model("users");

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                // done -> callback function
                return done(null, false, { message: "This account doesn't exists." });
            }
            // compare passwords
            bcrypt.compare(password, user.password, (err, match) => {
                if (match) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Incorrect password!" });
                }
            });
        });
    }));

    // save user data session 
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // search user by id
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
