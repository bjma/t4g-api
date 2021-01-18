/**
 * Filename: textController.demo.js
 * 
 * Controller for text data, stored in a testing/demo database.
 * Should only be used for demonstration purposes.
 */

 const { DemoModel } = require('../../models/proj2/textModel');

 /** 
  * GET endpoint;
  * Retrieves data from collection specific to DemoModel 
  * 
  * Refer to: models/proj2/textModel.js
  */
exports.index = async (req, res) => {
    let data = await DemoModel.find({}, null, {limit: 10}).lean().exec((err, content) => {
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
 * Indexes a new entry in the database. 
 */
exports.new = async (req, res) => {
    /* If the request is of type Array, we need to handle it differently
        than if it were a single Object. */
    if (req.body instanceof Array) {
        for (let i = 0; i < req.body.length; i++) {
            let element = req.body[i]; /* Reference to JSON content */

            let text = new DemoModel({
                title: element.title,
                query: element.query,
                labels: element.labels,
            });
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
        //console.log(data);
        //console.log(req.body);
        let text = new DemoModel({
            title: data.title,
            query: data.query,
            labels: data.labels,
        });
        text.save();
    }
    
    res.send("Successfully uploaded data into DB.")
        .end();
}