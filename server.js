/**
 * Filename: index.js
 * 
 * The crux of our API; it defines all the libraries we use,
 * as well as handles most of the initialization for our server.
 */

 /* Modules */
const express = require('express');

/* API Middleware */
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

/* Server instance */
const app = express(); 

/** 
 * Middleware for the API;
 * Make sure to maintain this order when adding new ones;
 * CORS should be the first one to be instantiated, then 
 * the bodyParser middlewares. 
 */ 
app.use(cors({origin: '*'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false })); /* Parse x-www-form-urlencoded */
app.use(express.json());

/* HTML Rendering */
app.set('view engine', 'ejs'); 

/* Port that the server runs on; one is for production and other one for local testing. */
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

    app.listen(port, () => {
        console.log(`API currently running on port ${port}`);
    });
});