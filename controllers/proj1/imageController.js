/**
 * fileName: imageController.js
 * Controller for image data; handles requests and defines endpoints
 */
const Image = require('../../models/proj1/imageModel');

 // GET (read) endpoint
exports.index = async (req, res) => {
    // Really long string of functions that essentially converts the Mongoose document to JSON
    // Source: https://stackoverflow.com/questions/9952649/convert-mongoose-docs-to-json
    let data = await Image.find({}, null, {limit: 50}).lean().exec((err, content) => {
        return res.json({
            total: Image.count({}, (err, count) => {
                return count;
            }),
            entries: data,
        });
    });
 }

// POST endpoint; adds a new image to the database (might tweak it to add all images)
exports.new = async (req, res) => {
    let image = new Image();
    image.name = req.body.name ? req.body.name : contact.name;
    image.byteData = req.body.byteData;
    image.features = req.body.features;
    // Save image
    image.save((err) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                message: "Successfully added new image.",
                data: image,
            });
        }
    });
}