/**
 * fileName: textController.js
 * 
 * Controller for text data to be used in the NLP project; 
 * handles requests and defines API endpoints.
 */

/* Define a queue for processing background jobs */
const Queue = require("bull");
const REDIS_URL = process.env.REDIS_URL;

let workQueue = new Queue("work", REDIS_URL);

 /* Import TextModel from the textModel  */
const { TextModel } = require('../../models/proj2/textModel');

/**
 * GET endpoint;
 * Retrieves text data by sending a GET request to the database.
 */
exports.index = async (req, res) => {
    let data = await TextModel.find({}, null).lean().exec((err, content) => {
        if (err) {
            return res.json({
                message: err
            });
        } else {
            return res.json({
                description: `Successfully received ${content.length} items from the database.`,
                length: content.length,
                data: content,
            })
            .end();
        }
    });
}

/**
 * POST endpoint (THIS NEEDS TO BE TESTED THOROUGHLY);
 * Indexes a new entry in the database. Scalable implementation should be able
 * to handle duplicate exceptions.
 */
exports.new = async (req, res) => {
    let data = {};
        
    /* Check if request is of type form */
    // Just added since we don't know if form data is an array or single object
    // be sure to test this if you see this comment :)
    if (typeof req.body.data != 'undefined') {
        try {
            data = JSON.parse(req.body.data);
        } catch (err) {
            console.log(err);
            return res.redirect('../errors');
        }
    } else {
        data = req.body;
    }

    /* Queue job to background Node.js process */
    let job = await workQueue.add({
        content: data,                     // Data to post
        collection: "text-query-data",  // Collection to post to 
    });

    /* Then, we return a response to prevent Heroku's request timeout after 30 secs. */
    res.json({message: `processing job ${job.id}`}).end();
}

// Listen to global events to get notified when jobs are processed
workQueue.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result}`);

});