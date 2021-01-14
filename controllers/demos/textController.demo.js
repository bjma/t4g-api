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
    /*let data = await DemoModel.find({}, null, {limit: 10}).lean().exec((err, content) => {
        if (err) {
            return res.json({
                message: err
            });
        } else {
            return res.json({
                data: {
                    description: "Congrats! Successfully received the following data from the database.",
                    textData: JSON.stringify(content)
                }
            })
                .end();
        }
    });*/
    return res.json({
        status: "OK",
        message: "GET endpoint currently working."
    });
}

/**
 * POST endpoint (THIS NEEDS TO BE TESTED THOROUGHLY);
 * Indexes a new entry in the database. 
 */
exports.new = async (req, res) => {
    let text = new DemoModel({
        title: req.body.title,
        query: req.body.query,
        answer: req.body.answer,
        labels: req.body.labels,
    });
    // Save entry
    text.save()
        .then(res.send("Successfully uploaded to DB").end());
}