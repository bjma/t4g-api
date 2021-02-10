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
 * Helper function that validates document data according to TextModel.
 * @param {Document} data  Document sent by requester
 */
const validateDocument = async (data, res) => {
    if (data instanceof Array) {
        data.forEach(element => {
            let TextDocument = new TextModel({
                title: element.title,
                query: element.query,
                label: element.label
            })
            if (TextDocument.validateSync()) {
                return res.redirect('../errors');
            }
        });
    } else {
        let TextDocument = new TextModel({
            title: data.title,
            query: data.query,
            label: data.label
        })
        if (TextDocument.validateSync()) {
            return res.redirect('../errors');
        }
    }
    console.log("success");
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
            return res.redirect('../errors');
        }
    } else {
        data = req.body;
    }

    /* Document validation using Mongoose; we have to do this before
       we pass it to the work queue since Mongoose isn't compatible with BullJS. */
    await validateDocument(data);

    /* Queue job to background Node.js process */
    let job = await workQueue.add({
        content: data,                     // Data to post
        collection: "text-query-data",     // Collection to post to 
    });

    /* Then, we return a response to prevent Heroku's request timeout after 30 secs. */
    res.redirect('../datasets/proj2');
}