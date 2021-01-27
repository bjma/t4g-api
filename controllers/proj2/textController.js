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
                description: "Successfully received the following data from the database.",
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
            return res.redirect('../errors');
        }
    } else {
        data = req.body;
    }

    /* If the request is of type Array, we need to handle it differently
        than if it were a single Object. */
    if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
            let element = data[i]; /* Reference to JSON content */
            let text = new TextModel({ /* Create new document for current element */
                title: element.title,
                query: element.query,
                label: element.label,
            });
            /* Save into DB */
            text.save()
                .catch((err) => {
                    console.log(err);
                    return res.redirect('../errors');
                });
        }
    } else {
        let text = new TextModel({
            title: data.title,
            query: data.query,
            label: data.label,
        });
        /* TODO: Add error handling for POST and GET requests, as well as duplicate entries */
        text.save()
            .then((user) => {
                //return res.send({message:"Success!"});
                return res.redirect('../datasets/proj2');
            })
            .catch((err) => {
                console.log(err);
                //return res.redirect('../errors');
            });
    }
}