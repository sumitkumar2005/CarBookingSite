# API Documentation

## Endpoint: `/users/register`

### Description
The `/users/register` endpoint allows users to register a new account by providing their personal information, including full name, email, and password. The system validates the input data and creates a new user record in the database.

### Example Request Body
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Validation Rules
- `fullname.firstname`: Must be a string, required, with a minimum length of 3 characters.
- `fullname.lastname`: Must be a string, required, with a minimum length of 3 characters.
- `email`: Must be a valid email format, required, and unique.
- `password`: Must be a string, required, with a minimum length of 6 characters.

### Responses
#### Success Response
- **Status Code**: 201 Created
- **Description**: User registration was successful, and a token is generated for authentication.
```json
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
```

#### Error Responses
1. **Validation Errors**
   - **Status Code**: 400 Bad Request
   - **Description**: The provided input data does not meet the validation criteria.
   ```json
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
   ```

2. **Duplicate Email**
   - **Status Code**: 400 Bad Request
   - **Description**: The provided email is already registered.
   ```json
   {
     "message": "Email already in use"
   }
   ```

3. **Server Errors**
   - **Status Code**: 500 Internal Server Error
   - **Description**: An unexpected error occurred while processing the request.
   ```json
   {
     "message": "An error occurred while registering the user. Please try again later."
   }
   ```

---

## Endpoint: `/users/login`

### Description
The `/users/login` endpoint allows registered users to log in by providing their email and password. The system validates the input, authenticates the user, and generates a token for future requests.

### Example Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Validation Rules
- `email`: Must be a valid email format, required.
- `password`: Must be a string, required, with a minimum length of 6 characters.

### Responses
#### Success Response
- **Status Code**: 200 OK
- **Description**: User login was successful, and a token is generated for authentication.
```json
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
```

#### Error Responses
1. **Validation Errors**
   - **Status Code**: 400 Bad Request
   - **Description**: The provided input data does not meet the validation criteria.
   ```json
   {
     "errors": [
       {
         "msg": "Invalid Email",
         "param": "email",
         "location": "body"
       },
       {
         "msg": "Password must be at least 6 characters long",
         "param": "password",
         "location": "body"
       }
     ]
   }
   ```

2. **Invalid Credentials**
   - **Status Code**: 401 Unauthorized
   - **Description**: The provided email or password is incorrect.
   ```json
   {
     "message": "Invalid email or password"
   }
   ```

3. **Server Errors**
   - **Status Code**: 500 Internal Server Error
   - **Description**: An unexpected error occurred while processing the request.
   ```json
   {
     "message": "An error occurred while logging in. Please try again later."
   }
   ```

---

## Notes
- The password field is securely hashed before storing in the database.
- The token is a JSON Web Token (JWT) used for authentication in subsequent requests.
- Ensure the `Authorization` header is set with the token for protected routes.
