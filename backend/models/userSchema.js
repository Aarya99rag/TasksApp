const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName : {
        type: String,
    },
    email : {
        type: String,
    },
    password : {
        type: String,
    },
    createdOn : {
        type : Date,
        default : new Date().getTime(),
        // Sets a default value if none is provided when creating a document.  Calls new Date() (current date/time) and .getTime() returns its timestamp in milliseconds.
    },
});

module.exports = mongoose.model("User", userSchema);