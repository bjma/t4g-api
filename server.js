/**
 * Filename: index.js
 * The crux of our API; it defines all the libraries we use,
 * as well as handles most of the initialization for our API.
 * 
 * There isn't much to be done here.
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express(); 

/* Middleware for the API */
app.use(cors({origin: '*'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false })); /* Parse x-www-form-urlencoded */
app.use(express.json());

/* HTML Rendering */
app.set('view engine', 'ejs'); 

/* Port that the server runs on; don't change this */
const port = process.env.PORT || 3000;

/* Database information */
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true});
const connection = mongoose.connection;

/* Launch app and establish connection */
connection.once('open', () => {
    console.log("Successfully connected to database.");
    
    /* Import routes; these represent different endpoints that our API offers. */
    const routes = require('./routes');
    app.use('/api', routes);

    const server = app.listen(port, () => {
        console.log(`API currently running on port ${port}`);
    });
    /**
     * TODO: Create background dyno in Heroku for requests that take a long time
     * to resolve. This way, we can send a response before the timeout occurs,
     * while asynchronously handling requests in the background.
     * 
     * Stuff to read:
     * 1. https://devcenter.heroku.com/articles/background-jobs-queueing
     * 2. https://stackoverflow.com/questions/64851732/how-to-avoid-request-timeout-on-heroku
     * 3. https://devcenter.heroku.com/articles/request-timeout
     * 4. https://www.heroku.com/dynos
     * 5. https://www.heroku.com/dynos/configure
     */
});