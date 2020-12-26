# Tech4Good Deep Learning API
Pretty simple RESTful API made for Tech4Good's deep learning team. Does the basic CRUD operations (still need to finish) and follows MVC structure.

## Endpoints
(If you're reading this, I haven't finished yet) The way we structured this is so that we can have multiple HTTP endpoints to retrieve specific datasets from a particular project. All you have to do to access the data is use a request library (like `fetch` in JavaScript or `requests` in Python) to take in the HTTP endpoint you want. The API will send a response in JSON format, which can easily be read using various Python machine learning libraries.

Below, you can find the specific endpoints that we've used so far.

### Web Component Image Classifier (Project 1)
This endpoint gets you the entire dataset of web component images as an array of JSON object, with features and byte data.
```
https://t4g-dl-api.herokuapp.com/api/proj1/dataset
```

You can also make `POST` requests from this endpoint as well.