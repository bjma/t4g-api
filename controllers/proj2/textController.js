/**
 * fileName: textController.js
 * 
 * Controller for text data to be used in the NLP project; 
 * handles requests and defines API endpoints.
 */

/* Define a queue for processing background jobs */
const Queue = require("bull");
const REDIS_URL = process.env.REDIS_URL;

/**
 * Definition of a first-come-first-serve (FCFS) job queue for processing requests;
 * The server uses Redis to cache a request's information and stores it to this queue, and
 * then returns an HTTP response. Heroku worker dynos takes each task from the queue
 * and resolves each request in a background NodeJS process (see `workers.js`).
 */
let workQueue = new Queue("work", REDIS_URL, {
    defaultJobOptions: { 
        removeOnComplete: true,
        removeOnFailed: true }
});

 /* Mongoose Document Validation (currently not in use)  */
const { TextModel } = require('../../models/proj2/textModel');

/**
 * Validates document sent via POST request against defined DB schema.
 * 
 * NOTE: The DB schema has not actually been implemented yet. Previously, Mongoose was used
 * for document validation, but it's not compatible with BullJS, which is what we use for processing
 * concurrent requests.
 * 
 * @param {Document} data  
 */
const isValid = (data) => {
    return (Array.isArray(data.title)) && (Array.isArray(data.query)) && (data.label && typeof data.label === 'string');
}

 /**
  * Preemption for validating documents sent by request
  * @param {*} data Document sent by requester
  */
const preemptValidation = async (data) => {
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
        
    /**
     * There are two ways we can recieve/make a POST request: 
     * 1. REST Client
     *      - This could be something like Postman, or even cURL
     * 2. Front-end client
     *      - The T4G DL API has a front-end client that sends post requests as form data. 
     *        If we see that a request's body contains the field "data", 
     *        we know that it was sent as a form, not from a REST client. 
     */
    if (typeof req.body.data != 'undefined') { // Front-end client
        try {
            data = await JSON.parse(req.body.data);
        } catch (err) {
            console.log(err);
            return res.redirect('../errors');
        }
    } else {                                   // Anything else
        data = req.body;
    }

    /* Document validation using Mongoose; we have to do this before
       we pass it to the work queue since Mongoose isn't compatible with BullJS. */
    let validationPassed = await preemptValidation(data);
    if (!validationPassed) {
        return res.redirect('../errors');
    }
    /* Queue job to background Node.js process */
    let job = await workQueue.add({
        content: data,                     // Data to post
        collection: "text-query-data",     // Collection to post to 
    });

    /* Then, we return a response to prevent Heroku's request timeout after 30 secs.
       Conceptually, this also allows our server to simultaneously listen for multiple HTTP requests
       and resolve other HTTP requests in the background. */
    return res.redirect('../datasets/proj2');
}