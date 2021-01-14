/**
 * Filename: routes.js
 * 
 * Contains all endpoints that our API offers.
 * Each route support their listed methods.
 */
const express = require('express');
const router = express.Router();

/* Default API response */
router.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "API endpoint is currently working.",
    })
});

/* Routes to image datasets for Project 1 */
const imageController = require('./controllers/proj1/imageController');
router.route('/proj1/dataset')
    .get(imageController.index)
    .post(imageController.new);

/* Routes to text dataset for Project 2 */ 
const textController = require('./controllers/proj2/textController');
router.route('/proj2/dataset')
    .get(textController.index)
    .post(textController.new);

/* Routes for API functionality demo */
const textControllerDemo = require('./controllers/demos/textController.demo');
router.route('/demos/nlp')
    .get(textControllerDemo.index)
    .post(textControllerDemo.new);
    
/* Export routes to other files */
module.exports = router;