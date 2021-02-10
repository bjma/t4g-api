/**
 * Filename: routes.js
 * 
 * Contains all endpoints that our API offers.
 * Each route support their listed methods.
 */

 /* Dependencies */
const express = require('express');
const router = express.Router();

/* Exported modules */
const textController = require('./controllers/proj2/textController');
const textControllerDemo = require('./controllers/demos/textController.demo');

/** 
 * Default API response
 */
router.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "API endpoint is currently working.",
    })
});

/**
 * Routes for datasets 
 */ 
router.route('/datasets/proj1')
    .get((req, res) => {
        res.json({
            message: "This endpoint is deprecated."
        });
    });
router.route('/datasets/proj2')
    .get(textController.index)
    .post(textController.new);

/** 
 * Routes for the frontend interface used to upload scraped data.
 * This is specifically for Project 2.
 */ 
router.route('/post/proj2')
    .get((req, res) => {
        res.render('text-post');
    });

/**
 * Routes for error handling 
 */
router.route('/errors')
    .get((req, res) => {
        res.json({
            status: "ERROR",
            message: "Oops! Something went wrong, probably a bad request."
        })
    });

/**
 * Routes for API functionality demo 
 */
router.route('/demos/nlp')
    .get(textControllerDemo.index)
    .post(textControllerDemo.new);

/* Export routes to other files */
module.exports = router;