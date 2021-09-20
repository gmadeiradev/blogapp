if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURI: "mongodb+srv://madeira:<blogapp>@cluster0.ptncf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    }
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/blogapp"
    }
}