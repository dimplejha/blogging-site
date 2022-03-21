const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, body: {
        type: String,
        required: true
    }, authorId: {
        type: objectId,
        ref: 'Author'
    },
    tags: [String],
    category:
    {
        type: [String],
        required: true
    }, subcategory: [String],
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
    },
    publishedAt: {
        type: Date,
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)