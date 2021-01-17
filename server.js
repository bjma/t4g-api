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
var bodyParser = require('body-parser');

const app = express(); 

/* Middleware for the API */
app.configure(() => {
    app.use(cors({origin: '*'}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
});

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

    app.listen(port, () => {
        console.log(`API currently running on port ${port}`);
    });
});