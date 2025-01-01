Endpoint Overview

URL:

POST /users/register

Description:

The /users/register endpoint allows users to register a new account by providing their personal information, including their full name, email, and password. The system validates the input data and creates a new user record in the database.

Example Request Body:

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}

Validation Rules:

fullname.firstname: Must be a string, required, with a minimum length of 3 characters.

fullname.lastname: Must be a string, required, with a minimum length of 3 characters.

email: Must be a valid email format, required, and unique.

password: Must be a string, required, with a minimum length of 6 characters.

Response

Success Response:

Status Code: 201 Created

Description: User registration was successful, and a token is generated for authentication.

Response Body:

{
  "token": "<JWT Token>",
  "user": {
    "_id": "<User ID>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}

Error Responses:

1. Validation Errors:

Status Code: 400 Bad Request

Description: The provided input data does not meet the validation criteria.

Response Body:

{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    },
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}

2. Duplicate Email:

Status Code: 400 Bad Request

Description: The provided email is already registered.

Response Body:

{
  "message": "Email already in use"
}

3. Server Errors:

Status Code: 500 Internal Server Error

Description: An unexpected error occurred while processing the request.

Response Body:

{
  "message": "An error occurred while registering the user. Please try again later."
}

How to Use

Request:

Send a POST request to /users/register with a JSON body containing fullname, email, and password.

Validation:

Ensure all required fields are provided and adhere to the validation rules.

Response Handling:

Handle success responses to store the token and user information.

Handle error responses to display appropriate messages to the user.

Notes

The password field is securely hashed before storing in the database.

The token is a JSON Web Token (JWT) used for authentication in subsequent requests.

Ensure the Authorization header is set with the token for protected routes