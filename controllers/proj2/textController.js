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
    /*let data = await TextModel.find({}, null, {limit: 50}).lean().exec((err, content) => {
        if (err) {
            return res.json(err);
        } else {
            return res.end(JSON.stringify(content));
        }
    });*/
    return res.json({message: "This endpoint is currently working."});
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

            let text = new TextModel({
                title: element.title,
                query: element.query,
                answer: element.answer,
                labels: element.labels,
            });

            text.save()
                .then(res.send("Successfully uploaded to DB.").end())

        }
    } else {
        let text = new TextModel({
            title: req.body.title,
            query: req.body.query,
            answer: req.body.answer,
            labels: req.body.labels,
        });
        // Save entry
        text.save()
            .then(res.send("Successfully uploaded to DB").end());
    }
}