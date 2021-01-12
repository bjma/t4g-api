/**
 * Model for how image data is stored in the database;
 * Basically acts as a "struct" for each entry in the index.
 */
const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    byteData: {
        type: String,
        required: true,
    },
    features: {
        type: Object,
        required: true,
    }
});

/* Export Image model */
module.exports = mongoose.model("Image", imageSchema, "image-data");