const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
})

const Comment = mongoose.model("comments", CommentsSchema);

module.exports = Comment;
