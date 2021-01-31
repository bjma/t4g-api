/**
 * Filename: routes.js
 * 
 * Contains all endpoints that our API offers.
 * Each route support their listed methods.
 */
const express = require('express');
const router = express.Router();

/* Define a queue for processing background jobs */
const Queue = require("bull");
const REDIS_URL = process.env.REDIS_URL;

let workQueue = new Queue("work", REDIS_URL);

/* Default API response */
router.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "API endpoint is currently working.",
    })
});

/* Routes to image datasets for Project 1 */
const imageController = require('./controllers/proj1/imageController');
router.route('/datasets/proj1')
    .get(imageController.index)
    .post(imageController.new);

/* Routes to text dataset for Project 2 */ 
const textController = require('./controllers/proj2/textController');
router.route('/datasets/proj2')
    .get(textController.index)
    .post(textController.new);

/* Routes for API functionality demo */
const textControllerDemo = require('./controllers/demos/textController.demo');
router.route('/demos/nlp')
    .get(textControllerDemo.index)
    .post(textControllerDemo.new);

/* Routes for the frontend interface used to upload scraped data.
    This is specifically for Project 2. */
router.route('/post/proj2')
    .get((req, res) => {
        res.render('text-post');
    });

/* Routes for error handling */
router.get('/errors', (req, res) => {
    res.json({
        status: "ERROR",
        message: "Oops! Something went wrong, probably a bad request."
    });
});

/* Router to query job states */
router.get('/job/:id', async (req, res) => {
    let id = req.params.id;
    let job = await workQueue.getJob(id);

    if (job === null) {
        res.status(404).end();
    } else {
        let state = await job.getState();
        let progress = job._progress;
        let reason = job.failedReason();
        res.json({
            id,
            state,
            progress,
            reason
        });
    }
});

/* Export routes to other files */
module.exports = router;