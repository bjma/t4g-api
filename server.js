/**
 * Filename: index.js
 * All the fun stuff
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

// Express instance
const app = express(); 
app.use(cors()); // some op shit

// Local port for testing stuff; gonna use Mongoose to hook this up to the db later
const port = process.env.PORT || 3000;

// Establish connection to database
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true});
const connection = mongoose.connection;

// Open connection
connection.once('open', () => {
    console.log("Successfully connected to database.");
    
    // Import our routes
    const routes = require('./routes');
    // Link the routes to our API
    app.use('/api', routes);

    // Launches the server on specified port
    app.listen(port, () => {
        console.log(`API currently running on port ${port}`);
    });
});
