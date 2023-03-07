const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema(
    {
        img: {
            type: String,
            required: true
        },
        thumbnail_1: {
            type: String,
            required: true
        },
        thumbnail_2: {
            type: String,
            required: true
        },
        thumbnail_3: {
            type: String,
            required: true
        },
        author_id: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;