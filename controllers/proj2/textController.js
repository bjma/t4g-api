/**
 * fileName: textController.js
 * 
 * Controller for text data to be used in the NLP project; 
 * handles requests and defines API endpoints.
 */

const Text = require('../../models/proj2/textModel');

/**
 * GET endpoint;
 * Retrieves text data by sending a GET request to the database.
 */
exports.index = async (req, res) => {
    /*let data = await Text.find({}, null, {limit: 50}).lean().exec((err, content) => {
        if (err) {
            return res.json(err);
        } else {
            return res.end(JSON.stringify(content));
        }
    });*/
    return res.json({message: "This endpoint is currently working."})
}

/**
 * POST endpoint (THIS NEEDS TO BE TESTED THOROUGHLY);
 * Indexes a new entry in the database. Scalable implementation should be able
 * to handle duplicate exceptions.
 */
exports.new = async (req, res) => {
    let text = new Text({
        query: req.body.query,
        answer: req.body.answer,
        features: req.body.features,
    });
    // Save entry
    text.save()
        .then(res.json({response: "ok"}).end())
        .catch(e => res.json({message: e.message}));
}