# T4G Deep Learning API Documentation
## Table of Contents
* [Application](#Application)
* [Routes](#Routes)
* [Model-View-Controller Structure (MVC)](#Model-View-Controller)
* [Concurrent Requests](#Concurrent-Requests)
* [Local Testing](#Local-Testing)

## Application
The overlying application architecture for the T4G Deep Learning API revolves around the following tech stack: NodeJS, MongoDB, and Express.

We use [NodeJS](https://nodejs.org/en/docs/) to build the bulk of the application; the server, API, and database connection are all done using Node. We use [Express](https://expressjs.com/en/5x/api.html), a light-weight NodeJS application, as a complementary library to Node, allowing us to easily set up and define endpoints for our API.

All the datasets (and maybe eventually things like model architectures) are stored in a [MongoDB](https://docs.mongodb.com/drivers/node/) database, using the [Mongoose ODM](https://mongoosejs.com/) for document validation between the database and API.

To host the actual NodeJS app, we use the [Heroku](https://devcenter.heroku.com/categories/nodejs-support) platform with [Redis](https://redis.io/topics/quickstart) for server caching. We could use something like Docker, which is much cooler and more relevant, but Heroku is super easy to set-up and maintain, so this is what we're using for now.

![application-diagram](https://i.imgur.com/LXzPiO8.png)

Heroku uses virtual containers called [dynos](https://www.heroku.com/dynos) to containerize the app; the dynos we use are defined in the `Procfile`. You'll notice two types of dynos shown:

```
web: node server.js
worker: node worker.js
```

The web dyno is the main dyno used to containerize our entire application; its main job is to listen to requests and load static web content. The worker dyno is a bit more interesting, as it allows our API to process large requests in the background, while the web dyno continues to listen to more requests, making the API much faster and more powerful. We'll go over this in the [concurrent requests](#Concurrent-Requests) section further down in the documentation.

## Routes
We use Express to define our routes, all of which are contained in the `routes.js` file, each serving a specific [HTTP request](https://www.w3schools.com/tags/ref_httpmethods.asp#:~:text=HTTP%20works%20as%20a%20request,also%20contain%20the%20requested%20content.).

Setting up a route is actually quite simple, we just need an Express instance and [router](https://expressjs.com/en/5x/api.html#router) object. 

```javascript
const express = require('express');
const router = express.Router();
```

We can use the `route()` method to define an *endpoint*, chaining it with methods for specific HTTP requests, like `get()` or `post()`. Below is a snippet of a simple route that returns a simple JSON message:

```javascript
router.route("/this-is-an-endpoint")
    .get((req, res) => {
        res.json({ message: "Hello!" });
    });
```

Our server, defined in `server.js`, is able to access these routes by having the modules in `routes.js` exported to `server.js`.

### Endpoints
The API currently supports the following endpoint(s):
* NLP Dataset for Text Classification (Project 2)
    * [GET](https://t4g-dl-api.herokuapp.com/api/datasets/proj2)
    ```
    https://t4g-dl-api.herokuapp.com/api/datasets/proj2
    ```
    * [POST](https://t4g-dl-api.herokuapp.com/api/post/proj2)
    ```
    https://t4g-dl-api.herokuapp.com/api/post/proj2
    ```


## Model-View-Controller
The app structure follows the basic [MVC Architecture](https://www.tutorialspoint.com/struts_2/basic_mvc_architecture.htm). Essentially, our application responds to an event by having a *controller* to handle the request, with the *model* to validate our document schemas. The *view* layer displays the response to the user.

![mvc](https://www.edureka.co/blog/wp-content/uploads/2019/08/MVC-1.png)

Essentially, the *controller* defines the behavior of our API, the *model* defines what the data being communicated to and from our API should look like, and the *view* defines how our API shows the data.

Our app has a folder for each layer in the MVC architecture, each containing a folder for a specific project.

```
├── models
│   └── model.js
├── controllers
│   └── controller.js
└── views
    └── view.ejs
```

## HTTP Requests
The API supports two main HTTP requests: `GET` and `POST`. To retrieve datasets using the API, we would make a `GET` request to one of the endpoints in the `/api/datasets/` route. To make a `POST` request (i.e. when we're doing data collection), we would go to the `/api/post/` routes.

### Making a GET request
Making a `GET` request is pretty simple. One option is to directly visit the endpoint URL, where the data is returned in JSON format. We can also make a `GET` request from the command line, using `cURL`:

```bash
curl "https://t4g-dl-api.herokuapp.com/api/datasets/:{endpoint}"
```

The command line would then respond with a JSON containing the dataset requested by the specific endpoint. Alternatively, you could retrieve data using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in JavaScript, or the [requests](https://pypi.org/project/requests/) in Python. You can refer to sample code [here](##examples).

### Making a POST request
Making a `POST` request is a bit more complicated, as you'd need a REST client if you wanted to simply "upload" your collected data to the database. You could alternatively write a Python script with `pymongo` or use `cURL`, but for the sake of your sanity, we have a frontend client (located at route `/api/post/`) for your data `POST`ing needs. Simply copy and paste content from your JSON file and click "submit", and you should be redirected to the `GET` endpoint for specific dataset you're uploading to!

## Concurrent Requests
> This stub still needs to be completed

## Local Testing
> This stub still needs to be completed