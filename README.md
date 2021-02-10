# Tech4Good Deep Learning API

When building and training machine learning models distributed amongst a team, it's important to ensure that there is consistency in the datasets in use. The **Tech4Good Deep Learning API** allows you to retrieve and send *real-time* data with low latency to be used to train your machine learning models.

The API follows basic [REST](https://www.redhat.com/en/topics/api/what-is-a-rest-api) guidelines and [MVC](https://www.tutorialsteacher.com/mvc/mvc-architecture) structure, built with [Node.js](https://nodejs.org/en/about/).

## Dependencies and Stack
The API is primarily developed using *Node.js*, a back-end JavaScript runtime environment that helps build powerful web applications. We used [Express](https://expressjs.com/) for handling API endpoints and methods, [Redis](https://redis.io/topics/introduction) for server caching, and [Bull](https://github.com/OptimalBits/bull/) for managing queues of background jobs. Additionally, we use the [MongoDB](https://mongodb.github.io/node-mongodb-native/) native driver to connect and communicate with our database.

## App Structure
The app structure is designed with the MVC guidelines in mind, meaning, we organized our code to be delegated to the following roles:
* Models
    * This is for document validation. When we upload data to a database, we want to enforce a *schema* so that there won't be any inconsistencies in how we format our data.
    * Currently, we use [Mongoose](https://mongoosejs.com/) to handle schema validation.
* Views
    * We also want some sort of front-end client for team members to upload collected data to the database. Thus, we have dedicated files for the sake of doing so.
    * We render HTML content using [embedded JavaScript templating](https://ejs.co/).
* Controllers
    * This is the crux of the API. Controllers are dedicated to handling HTTP requests from multiple endpoint, and we dedicate each controller to a specific endpoint.
    * Controllers handle requests like `GET` and `PUT`. We pass controller functions by exporting it to the other modules in the app, namely, `routes.js`

We define each route, or a set of endpoints, in `routes.js`. The `server.js` file initalizes and starts the server; it essentially acts as the main function of the app. 

Since we deal with an intense amount of requests (especially for uploading data to the database), we use Redis to cache request data and queue it into a *work queue* with Bull. This way, we can process network intensive jobs in the background, while the web app continues to listen to requests. All the work is done in `worker.js`. To read more, brush up on OS concepts like concurrency strategies for threads.

## HTTP Requests
The API is defined by a set of [endpoints](##endpoints), and at each endpoint, you can make an HTTP request from there.

The API supports two main HTTP requests: `GET` and `POST`. To retrieve datasets using the API, we would make a `GET` request to one of the endpoints in the `/api/datasets/` route. To make a `POST` request (i.e. when we're doing data collection), we would go to the `/api/post/` routes.

### Making a GET request
Making a `GET` request is pretty simple. One option is to directly visit the endpoint URL, where the data is returned in JSON format. We can also make a `GET` request from the command line, using `cURL`:

```bash
curl "https://t4g-dl-api.herokuapp.com/api/datasets/:{endpoint}"
```

The command line would then respond with a JSON containing the dataset requested by the specific endpoint. Alternatively, you could retrieve data using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in JavaScript, or the [requests](https://pypi.org/project/requests/) in Python. You can refer to sample code [here](##examples).

### Making a POST request
Making a `POST` request is a bit more complicated, as you'd need a REST client if you wanted to simply "upload" your collected data to the database. You could alternatively write a Python script with `pymongo` or use `cURL`, but for the sake of your sanity, we have a frontend client (located at route `/api/post/`) for your data `POST`ing needs. Simply copy and paste content from your JSON file and click "submit", and you should be redirected to the `GET` endpoint for specific dataset you're uploading to!

## Endpoints
* NLP Dataset for Text Classification (Project 2)
    * [GET](https://t4g-dl-api.herokuapp.com/api/datasets/proj2)
    ```
    https://t4g-dl-api.herokuapp.com/api/datasets/proj2
    ```
    * [POST](https://t4g-dl-api.herokuapp.com/api/post/proj2)
    ```
    https://t4g-dl-api.herokuapp.com/api/post/proj2
    ```

## Errors
> This stub still needs to be completed.

## Examples
> This stub still needs to be completed.

