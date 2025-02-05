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

## Endpoint: `/users/logout`

### Description
The `/users/logout` endpoint allows users to log out by invalidating their current authentication token. The token is added to a blacklist to prevent further use.

### Example Request
#### Request Headers
```json
{
  "Authorization": "Bearer <JWT Token>"
}
```

### Responses
#### Success Response
- **Status Code**: 200 OK
- **Description**: User logout was successful.
```json
{
  "message": "User Logout Successfully"
}
```

#### Error Responses
1. **Invalid Token**
   - **Status Code**: 401 Unauthorized
   - **Description**: The provided token is invalid or has already been blacklisted.
   ```json
   {
     "message": "Unauthorized"
   }
   ```

2. **Server Errors**
   - **Status Code**: 500 Internal Server Error
   - **Description**: An unexpected error occurred while processing the request.
   ```json
   {
     "message": "An error occurred while logging out. Please try again later."
   }
   ```

---

## Endpoint: `/captains/register`

### Description
The `/captains/register` endpoint allows captains to register their details, including their full name, email, password, and vehicle details. The system validates the input data, hashes the password, and creates a new captain record in the database.

### Example Request Body
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ123",
    "capacity": 4,
    "vehicleType": "car"
  },
  "location": {
    "lat": 12.9716,
    "long": 77.5946
  }
}
```

### Validation Rules
- `fullname.firstname`: Must be a string, required, with a minimum length of 3 characters.
- `fullname.lastname`: Must be a string, required, with a minimum length of 3 characters.
- `email`: Must be a valid email format, required, and unique.
- `password`: Must be a string, required, with a minimum length of 6 characters.
- `vehicle.color`: Must be a string, required, with a minimum length of 3 characters.
- `vehicle.plate`: Must be a string, required, with a minimum length of 3 characters.
- `vehicle.capacity`: Must be a number, required, with a minimum value of 1.
- `vehicle.vehicleType`: Must be one of `["car", "bike", "auto"]`, required.

### Responses
#### Success Response
- **Status Code**: 201 Created
- **Description**: Captain registration was successful, and a token is generated for authentication.
```json
{
  "token": "<JWT Token>",
  "captain": {
    "_id": "<Captain ID>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ123",
      "capacity": 4,
      "vehicleType": "car"
    }
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
     "message": "An error occurred while registering the captain. Please try again later."
   }
   ```

---

## New Ride API Endpoints:

### Endpoint: `/rides`
#### Description
Returns a simple message indicating that this is the Ride API.

### Responses
#### Success Response
- **Status Code**: 200 OK
- **Description**: Ride API message returned successfully.
```json
{
  "message": "Ride API"
}
```

### Endpoint: `/rides/create`
#### Description
Creates a new ride. Requires authentication and validates the input for pickup location, drop-off location, and vehicle type.

### Example Request Body
```json
{
  "pickUp": "Location A",
  "dropOff": "Location B",
  "vehicleType": "car"
}
```

### Responses
#### Success Response
- **Status Code**: 201 Created
- **Description**: Ride created successfully.
```json
{
  "message": "Ride created successfully."
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
         "msg": "Invalid pickup location",
         "param": "pickUp",
         "location": "body"
       }
     ]
   }
   ```

2. **Authentication Errors**
   - **Status Code**: 401 Unauthorized
   - **Description**: User is not authenticated.
   ```json
   {
     "message": "Unauthorized"
   }
   ```

### Endpoint: `/rides/get-fare`
#### Description
Retrieves the fare for a ride. Requires authentication.

### Responses
#### Success Response
- **Status Code**: 200 OK
- **Description**: Fare retrieved successfully.
```json
{
  "fare": 20.00
}
```

---

## New Maps API Endpoints:

### Endpoint: `/maps`
#### Description
Returns a simple message ("hello").

### Responses
#### Success Response
- **Status Code**: 200 OK
- **Description**: Hello message returned successfully.
```json
{
  "message": "hello"
}
```

### Endpoint: `/maps/get-coordinates`
#### Description
Retrieves coordinates based on an address query parameter. Requires authentication and validation of the address.

### Example Request
```json
{
  "address": "123 Main St"
}
```

### Responses
#### Success Response
- **Status Code**: 200 OK
- **Description**: Coordinates retrieved successfully.
```json
{
  "success": true,
  "coordinates": {
    "lat": 12.9716,
    "long": 77.5946
  }
}
```

### Endpoint: `/maps/get-distance-time`
#### Description
Retrieves distance and time between origin and destination. Requires authentication and validation of both parameters.

### Example Request
```json
{
  "origin": "Location A",
  "destination": "Location B"
}
```

### Responses
#### Success Response
- **Status Code**: 200 OK
- **Description**: Distance and time retrieved successfully.
```json
{
  "success": true,
  "distanceTime": {
    "distance": "10 km",
    "time": "15 mins"
  }
}
```

### Endpoint: `/maps/get-suggestions`
#### Description
Provides suggestions based on an input query parameter.

### Example Request
```json
{
  "input": "Loc"
}
```

### Responses
#### Success Response
- **Status Code**: 200 OK
- **Description**: Suggestions retrieved successfully.
```json
{
  "suggestions": ["Location A", "Location B"]
}
