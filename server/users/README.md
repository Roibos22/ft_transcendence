# Users app

## Functions

Authentication, score tracking, session management.


## API Documentation

### Create User
*Endpoint:* /api/users/
*Method:* POST
*Description:* Creates a new user in the system.

### Request Headers
*Content-Type:* application/json
*Authorization:* Bearer <token> (if authentication is required)
*Request Body*

The request body should be in JSON format with the following structure:

**json:**
```
{
    "user": {
        "username": "string",
        "email": "string",
        "first_name": "string",
        "last_name": "string",
        "password": "string"
    },
    "status": "boolean",          // Optional: User's online status
    "avatar": "string (URL)",    // Optional: URL of the user's avatar image
    "friends": ["string"]        // Optional: List of friend usernames
}
```

### Fields

    user (object): User's basic information.
        username (string): The user's username. Required.
        email (string): The user's email address. Required.
        first_name (string): The user's first name. Optional.
        last_name (string): The user's last name. Optional.
        password (string): The user's password. Required.
    status (boolean): User's online status. Optional.
    avatar (string): URL to the user's avatar image. Optional.
    friends (array of strings): List of usernames for friends. Optional.

### Response
Success Response
Status Code: 201 Created

Response Body:

**json:**
```
{
    "user": {
        "username": "string",
        "email": "string",
        "first_name": "string",
        "last_name": "string"
    },
    "status": "boolean",
    "avatar": "string (URL)",
    "friends": ["string"]
}
```
### Error Response
Status Code: 400 Bad Request

Response Body:

**json:**
```
{
    "non_field_errors": [
        "Error message describing the issue"
    ],
    "username": [
        "Error message if username is invalid or already taken"
    ],
    "email": [
        "Error message if email is invalid or already in use"
    ],
    "password": [
        "Error message if password is missing or too weak"
    ]
}
```

### Examples

Example Request

http
```
POST /api/users/ HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer <token>

{
    "user": {
        "username": "johndoe",
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "password": "securepassword123"
    },
    "status": true,
    "avatar": "http://example.com/avatar.jpg",
    "friends": ["janedoe"]
}
```
Example Response
Success:

json
```
{
    "user": {
        "username": "johndoe",
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "status": true,
    "avatar": "http://example.com/avatar.jpg",
    "friends": ["janedoe"]
}
```
Error:

json
```
{
    "username": [
        "This username is already taken."
    ],
    "email": [
        "Enter a valid email address."
    ]
}
```
### Notes
Ensure that sensitive data, like passwords, are properly encrypted and not exposed in the response.
Follow any additional constraints or limitations, such as password policies or username uniqueness requirements.
