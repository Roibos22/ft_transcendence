# Users app

## Functions

Authentication, score tracking, session management.

## Structure

```json
{
    "user": {
        "username": "string",
        "email": "string",
        "first_name": "string",
        "last_name": "string",
        "password": "string"
    },
    "online": "boolean",
    "avatar": "string (URL)",
    "friends": ["int: id"],
    "games": ["int: id"]
}
```

## API Documentation

### Create User

*Endpoint:* /api/users/create/
*Method:* POST
*Description:* Creates a new user in the system.

#### Request Headers

*Content-Type:* application/json

*Authorization:* Bearer ***token*** (if authentication is required) - not implemented yet

*Request Body:* The request body should be in JSON format with the structure below

```json
{
    "user": {
        "username": "string",   // Required: User's basic information
        "email": "string",      // Required: The user's email address
        "first_name": "string", // Optional: The user's first name
        "last_name": "string",  // Optional: The user's last name
        "password": "string"    // Required: The user's password. Subject to validate
    },
    "avatar": "string (URL)",   // Optional: URL of the user's avatar image (empty)
}
```

#### Response

Success Response
Status Code: 201 Created

Response Body:

```json:
{
    "user": {
        "username": "string",
        "email": "string",
        "first_name": "string",
        "last_name": "string"
    },
    "avatar": "string (URL)"
}
```

### Update User

*Endpoint:* /api/user/update/
*Method:* PATCH
*Description:* Updates an existing user's data in the system.

Request Body
The request body should be in JSON format with the following structure:

```json
{
    "user": {
        "username": "string",   // Not allowed: Username is read-only
        "email": "string",      // Optional: The user's email address
        "first_name": "string", // Optional: The user's first name
        "last_name": "string",  // Optional: The user's last name
        "password": "string"    // Optional: The user's password. Subject to validate
    },
    "status": "boolean",        // Optional: User's online status
    "avatar": "string (URL)",   // Optional: URL of the user's avatar image
    "friends": ["string"]       // Optional: List of friend usernames
}
```

#### Update response

Success Response Status Code: 200 OK

Response Body:

```json
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

### Login

*Endpoint:* /api/user/update/
*Method:* POST
*Description:* Login to user's profile in the system.

Request Body
The request body should be in JSON format with the following structure:

```json
{
    "username": "string",
    "password": "string"
}
```

#### Login Response

*redirection to users profile* - in development

#### Example

```http
POST /api/users/login HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer <token>

{
    "username": "johndoe",
    "password": "securepassword123"
}
```

### Aplicable for all requests

#### Error Response

Status Code: 400 Bad Request

Response Body:

```json
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

#### Examples

Example Request

```http
POST /api/users/create HTTP/1.1
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
    }
}

```

#### Example Response

Success:

```json
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

#### Error

```json
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
