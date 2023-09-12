# Person API Documentation

## Introduction

This API allows you to perform CRUD operations on a 'Person' resource in a MySQL database.

## Installation

1. Ensure you have Node.js and MySQL installed on your machine.
2. Clone the GitHub repository.
3. Install the required packages using `npm install`.
4. Start the server using `npm start`.

## Endpoints

### POST /api

Creates a new person in the database.

**Request:**

JSON body must contain `name` field:

````{
    "name": "string"
}```

**Response:**

Returns a success message:
````

{
"status": boolean,
"message": "string",
"data": {
"person": {
"id": "string",
"name": "string"
}
}
}

````

### GET /api/:user_id

Retrieves a person's data from the database.

**Request:**

No body required. The user id is passed as a parameter in the URL.

**Response:**

Returns the person's data:

```   {
      "status": boolean,
      "message": "string",
      "data": {
          "person": {
              "id": "string",
              "name": "string"
          }
      }
  }
````

### PUT /api/:user_id

Updates a person's data in the database.

**Request:**

JSON body contains the new `name`:

```{
"name": "new name"
}
```
The user id is passed as a parameter in the URL.

**Response:**

Returns a success message:

```{
    "status": boolean,
    "message": "string",
    "data": {
        "person": {
            "id": "string",
            "name": "string"
        }
    }
}```
### DELETE /api/:user_id

Deletes a person's data from the database.

**Request:**

No body required. The user id is passed as a parameter in the URL.

**Response:**

Returns a success message:

json {
"message": "Person deleted."
}

## Errors

If a required field is missing or invalid, the API responds with a `400 Bad Request` status and an error message. For example, if the `name` field is missing or not a string in a `POST` or `PUT` request, the API will return:

json {
"errors": [
{
"msg": "Name must be a string",
"param": "name",
"location": "body"
}
]
}

## Examples

1. To add a new person named "Kofi" to the database, you would send a `POST` request to `http://localhost:8000/api` (use localhost when working in development) with the following body:

json {
"name": "Kofi"
}

You should receive a response with the message "Person added."

2. To retrieve the data of a person with an id of "1" from the database, you would send a `GET` as such `http://localhost:8000/api/1`. No body is required. The user id is passed as a parameter in the url.

You should receive a json as such:
json {
"id": 1,
"name": "string"
}

## Limitations & Assumptions

The API currently assumes that the 'name' field is always a string. It does not support other data types for the 'name' field.
