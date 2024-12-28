const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    todo : {
        type: String,
        required: true
    },
    expectedStartTime : {
        type: String,
        required: true
    },
    expectedEndTime : {
        type: String,
        required: true
    },
    markAsDone : {
        type: Boolean,
        default: false
    },
    priority : {
        type: String,
        required: true
    },
    dateOfCreation : {
        type : Date,
        default : new Date().getTime()
    },
    userId : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Todo",todoSchema)