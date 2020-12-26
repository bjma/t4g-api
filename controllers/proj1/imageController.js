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
        return res.end(JSON.stringify(content));
    });
 }

// DELETE (remove) endpoint
exports.delete = async (req, res) => {
     await Image.remove({
         _id: req.params._id
     }, (err, content) => console.log(err));
     res.json({
         status: "success",
         message: "Successfully deleted image."
     })
 }