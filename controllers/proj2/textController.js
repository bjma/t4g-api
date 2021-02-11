/**
 * fileName: textController.js
 * 
 * Controller for text data to be used in the NLP project; 
 * handles requests and defines API endpoints.
 */

/* Define a queue for processing background jobs */
const Queue = require("bull");
const REDIS_URL = process.env.REDIS_URL;

let workQueue = new Queue("work", REDIS_URL, {
    defaultJobOptions: { 
        removeOnComplete: true,
        removeOnFailed: true }
});

 /* Import TextModel from the textModel  */
const { TextModel } = require('../../models/proj2/textModel');

/**
 * Helper function that validates document data
 * @param {Document} data  
 */
const isValid = (data) => {
    return (data.title instanceof Array) && (data.query instanceof Array) && (data.label instanceof String);
}

 /**
  * Preemption for validating documents sent by request
  * @param {*} data Document sent by requester
  */
const preemptValidation = async (data) => {
    console.log(typeof data.title, typeof data.query, typeof data.label);
    if (data instanceof Array) {
        data.forEach(element => {
            if (!isValid(element)) {
                return false;
            }
        });
    } else {
        if (!isValid(data)) {
            return false;
        }
    }
    console.log("success");
    return true;
}

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
 * POST endpoint;
 * Indexes a new entry in the database. Each POST request
 * is added into a job queue, and the request data is cached using Redis.
 * 
 * Once the job is added to the queue, this endpoint returns a response
 * to avoid crashing the app due to a timeout. It should be noted that
 * Heroku will automatically timeout the application if a request 
 * takes longer than 30 seconds to resolve.
 */
exports.new = async (req, res) => {
    let data = {};
        
    /* Check if request is of type form */
    if (typeof req.body.data != 'undefined') {
        try {
            data = await JSON.parse(req.body.data);
        } catch (err) {
            console.log(err);
            return res.redirect('../../errors');
        }
    } else {
        data = req.body;
    }

    /* Document validation using Mongoose; we have to do this before
       we pass it to the work queue since Mongoose isn't compatible with BullJS. */
    let validationPassed = await preemptValidation(data);
    if (!validationPassed) {
        return res.redirect('../../errors');
    }
    /* Queue job to background Node.js process */
    let job = await workQueue.add({
        content: data,                     // Data to post
        collection: "text-query-data",     // Collection to post to 
    });

    /* Then, we return a response to prevent Heroku's request timeout after 30 secs. */
    return res.redirect('../datasets/proj2');
    
}