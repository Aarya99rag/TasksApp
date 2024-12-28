const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    tags : {
        type: [String],
        default: []
    },
    isPinned : {
        type: Boolean,
        default: false
    },
    userId : {
        type: String,
        required: true
    },
    createdOn : {
        type : Date,
        default : new Date().getTime(),
        // Sets a default value if none is provided when creating a document.  Calls new Date() (current date/time) and .getTime() returns its timestamp in milliseconds.
    },
});

module.exports = mongoose.model("Note", noteSchema);