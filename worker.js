/**
 * Worker process that handles network expensive requests
 * in the background.
 */
const throng = require("throng");
const Queue = require("bull");

const { MongoClient } = require("mongodb");

/* Setup MongoDB instance */
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });
const dbName = 'datasets';

/* Connect to Heroku provided URL for Redis */
const REDIS_URL = process.env.REDIS_URL;

/* Create multiple processes to handle jobs; basically concurrency in OS */
let workers = process.env.WEB_CONCURRENCY;

/* Maximum number of jobs a worker should process at once */
const maxJobsPerWorker = 50;

function start() {
    /* Connect to named work queue */
    let workQueue = new Queue("work", REDIS_URL);  
    let progress = 0;
    /* Process queued jobs */
    workQueue.process(maxJobsPerWorker, async (job) => {
        /* Connect to MongoDB instance */
        try {
            await client.connect();
        } catch (err) {
            console.log(err);
        }
        const db = client.db(dbName);
        const collection = db.collection(job.data.collection);

        /* Get data to save into database from job */
        let data = job.data.content;

        if (data instanceof Array) { // Case for multiple documents being uploaded
            console.log("Received the following documents: ", data);
            await collection.insertMany(data);
        } else { // Case for single document being uploaded
            console.log("Received the following document: ", data);
            await collection.insertOne(data);
        }
        /* Signal that we've resolved the promise */
        return Promise.resolve(); 
    });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });