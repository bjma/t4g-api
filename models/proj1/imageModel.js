/**
 * Schema for image data from the first project
 * Basically we do this to ensure that our responses from MongoDB are valid
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

// Export Image model
module.exports = mongoose.model("Image", imageSchema, "image-data");