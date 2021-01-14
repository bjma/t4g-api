/**
 * fileName: imageController.js
 * 
 * Controller for image data; handles requests and defines endpoints
 */
const Image = require('../../models/proj1/imageModel');

 /**
  * GET endpoint; retrieves data and returns it as a response in JSON format
  * @param {*} req  Incoming request; should be GET
  * @param {*} res  API response; should be in JSON format
  */
exports.index = async (req, res) => {
    // Really long string of functions that essentially converts the Mongoose document to JSON
    // Source: https://stackoverflow.com/questions/9952649/convert-mongoose-docs-to-json
    let data = await Image.find({}, null, {limit: 50}).lean().exec((err, content) => {
        if (err) {
            res.json(err).end();
        } else {
            // Should use end() in order to complete response.
            return res.json({
                description: "Image data for Project 1; each image has corresponding fields for fileName, byteData, and features.",
                data: JSON.stringify(content)
            })
                .end();
        }
    });
 }

/**
 * POST endpoint; sends a new document from requests into the database index
 * @param {*} req  Incoming request; should be POST
 * @param {*} res  API response; just sends status/error codes
 */
exports.new = async (req, res) => {
    const newImage = new Image({
        name: req.body.name,
        byteData: req.body.byteData,
        features: req.body.features,
    });
    // Save document into database
    newImage.save()
        .then(res.json({response: "ok"}))
        .catch(e => res.json({message: e.message}));
}

/* DELETE endpoint; untested */
exports.delete = async (req, res) => {
    Image.remove({
        _id: req.params._id
    }, (err, content) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                message: "Successfully deleted image"
            });
        }
    })
}