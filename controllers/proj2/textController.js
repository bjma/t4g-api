/**
 * fileName: textController.js
 * 
 * Controller for text data to be used in the NLP project; 
 * handles requests and defines API endpoints.
 */

 /* Import TextModel from the textModel  */
const { TextModel } = require('../../models/proj2/textModel');

/**
 * GET endpoint;
 * Retrieves text data by sending a GET request to the database.
 */
exports.index = async (req, res) => {
    let data = await TextModel.find({}, null, {limit: 50}).lean().exec((err, content) => {
        if (err) {
            return res.json({
                message: err
            });
        } else {
            return res.json({
                description: "Congrats! Successfully received the following data from the database.",
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
    /* If the request is of type Array, we need to handle it differently
        than if it were a single Object. */
    if (req.body instanceof Array) {/* Reference to JSON content */
        for (let i = 0; i < req.body.length; i++) {
            let element = req.body[i]; /* Reference to JSON content */
            let text = new TextModel({ /* Create new document for current element */
                title: element.title,
                query: element.query,
                labels: element.labels,
            });
            /* Save into DB */
            text.save();
        }
    } else {
        /* Check if request is of type form */
        let data = {};
        if (typeof req.body.data != 'undefined') {
            data = JSON.parse(req.body.data);
        } else {
            data = req.body;
        }
        let text = new TextModel({
            title: data.title,
            query: data.query,
            labels: data.labels,
        });
        text.save();
    }
    /* Resolve request */
    res.send("Successfully uploaded to DB.")
        .end();
}