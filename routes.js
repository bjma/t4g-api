/**
 * Filename: routes.js
 * Contains all endpoints for the API; should probably make it more clean but we can deal with that later
 */
const express = require('express');
const router = express.Router();

const Image = require('./models/proj1/imageModel');

// Default API response 
router.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "API endpoint is currently working.",
    })
});

// Routes for image datasets
const imageController = require('./controllers/proj1/imageController');
router.route('/proj1/dataset')
    .get(imageController.index)
    .post(imageController.new);
    
// Export routes to other files
module.exports = router;