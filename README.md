# Tech4Good Deep Learning API
Pretty simple RESTful API made for Tech4Good's deep learning team. Does the basic CRUD operations (still need to finish) and follows MVC structure.

## Endpoints
The API currently only supports the endpoint to the dataset used for our image classification project. As we continue with the NLP project, I'll be tweaking this API to handle endpoints for that.

### Web Component Image Classifier (Project 1)
This endpoint gets you the entire dataset of web component images as an array consiting of each image in our dataset, with information like features and byte data. The endpoint for this specific project dataset is found below, which can be accessed using the `requests` library in Python:
``` python
import requests
import json

# HTTP endpoint to the API; note the specific route we're using
API_ENDPOINT = "https://t4g-dl-api.herokuapp.com/api/proj1/dataset"
# Fetch the response from the endpoint using Python's request library
res = requests.get(API_ENDPOINT)
# Print the response as a JSON object (can be converted to Pandas dataframe)
print(res.json())
```

It returns each image in `JSON` format, shown below:
``` json
{
    "_id": {
        "type": "int",
        "description": "Unique ID"
    },
    "name": {
        "type": "String",
        "description": "Filename of image"
    },
    "byteData": {
        "type": "base64 String",
        "description": "Byte data of image"
    },
    "features": {
        "text": {
            "type": "integer",
            "description": "One-hot encoding for text feature"
        },
        "shape": {
            "type": "integer",
            "description": "One-hot encoding for shape feature"
        },
        "icon": {
            "type": "integer",
            "description": "One-hot encoding for icon feature"
        },
        "relativePositioning": {
            "type": "integer",
            "description": "One-hot encoding for relativePositioning feature"    
        },
    }
}
```

