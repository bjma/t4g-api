/**
 * Filename: routes.js
 * 
 * Contains all endpoints that our API offers.
 * Each route has a defined behavior for a specific request type.
 */

 /* Dependencies */
const express = require('express');
const router = express.Router();

/* Controller modules for each endpoint */
const textController = require('./controllers/proj2/textController'); // Project 2
const textControllerDemo = require('./controllers/demos/textController.demo'); // API functionality demo (can remove)

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
 * Routes for datasets used in a specific project.
 * 
 * Each dataset is currently categorized in numerical order (i.e. Project 1, Project 2, ..., Project N).
 * However, feel free to change how these datasets are named, as long as they remain consistent and ordered.
 */

/* Image Classification Dataset */
router.route('/datasets/proj1')
    .get((req, res) => {
        res.json({
            message: "This endpoint is deprecated."
        });
    });
/* Natural Language Processing Dataset (CodeMend) */
router.route('/datasets/proj2')
    .get(textController.index)
    .post(textController.new);

/** 
 * These routes are for the API's simple front-end client used for
 * making POST requests (much easier than using Postman or cURL).
 * 
 * Much like the datasets, each endpoint is categorized by its corresponding project number.
 */

/* Natural Language Processing (CodeMend) */
router.route('/post/proj2')
    .get((req, res) => {
        res.render('text-post'); // Renders embedded JavaScript template (EJS)
    });

/**
 * Routes for error handling.
 * 
 * We basically redirect the user to this endpoint whenever an error occurs.
 * This could definitely be fleshed out, perhaps to specify what sort of error occurred
 * (HTTP response code), as well as the context of the error (i.e. document validation failed).
 * 
 * Currently, it's only used as a general error message.
 */
router.route('/errors')
    .get((req, res) => {
        res.json({
            status: "ERROR",
            message: "Oops! Something went wrong, probably a bad request."
        })
    });

/**
 * Routes for API functionality demo.
 * Feel free to delete.
 */
router.route('/demos/nlp')
    .get(textControllerDemo.index)
    .post(textControllerDemo.new);

/* Export routes to other files */
module.exports = router;