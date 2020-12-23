/**
 * Filename: routes.js
 * Contains all endpoints for the API; should probably make it more clean but we can deal with that later
 */
const express = require('express');
const router = express.Router();

const Image = require('./models/proj1/imageModel');

// Default API response should return the database from the CNN project
router.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "API endpoint is currently working.",
    })
});

// Route for project 1 image datasets; currently only building GET endpoints for easy database access
router.get('/proj1', async (req, res) => {
    // Really long string of functions that essentially converts the Mongoose document to JSON
    // Source: https://stackoverflow.com/questions/9952649/convert-mongoose-docs-to-json
    let data = await Image.findOne().lean().exec((err, images) => {
        return res.end(JSON.stringify(images));
    });
});

// Export routes to other files
module.exports = router;