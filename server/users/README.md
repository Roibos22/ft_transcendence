Users App
=========

Overview
--------

The Users App handles user authentication, score tracking, session management, and related functionalities.

* * * * *

API Endpoints
-------------

### 1\. **Create User**

- **Endpoint:** ```/users/create/```
- **Method:** ```POST```
- **Description:** Creates a new user in the system.

#### Request

- **Headers:**

  - ```Content-Type: application/json```
  - ```Authorization: Bearer <token>```
- **Body:**

    ```json
    {
      "username": "string",      // Required: Username (unique)
      "email": "string",         // Required: Email address
      "first_name": "string",    // Optional: First name
      "last_name": "string",     // Optional: Last name
      "password": "string",      // Required: User password
      "avatar": "string (URL)",  // Optional: Avatar URL
      "active": "boolean"        // Optional: User active
    }
    ```

#### Success Response

- **Status:** ```201 Created```
- **Body:**

    ```json
    {
      "username": "string",
      "email": "string",
      "first_name": "string",
      "last_name": "string",
      "avatar": "string (URL)"
    }
    ```

* * * * *

### 2\. **Update User**

- **Endpoint:** ```/user/profile/<user_id>/update/```
- **Method:** ```PATCH```
- **Description:** Updates an existing user's information.

#### Request

- **Body:**

    ```json
    {
      "email": "string",        // Optional
      "first_name": "string",   // Optional
      "last_name": "string",    // Optional
      "password": "string",     // Optional
      "status": "boolean",      // Optional: Online status
      "avatar": "string (URL)", // Optional: Avatar URL
      "friends": ["string"]     // Optional: Friend usernames
    }
    ```

#### Success Response

- **Status:** ```200 OK```
- **Body:**

    ```json
    {
      "username": "string",     // Read-only
      "email": "string",
      "first_name": "string",
      "last_name": "string",
      "status": "boolean",
      "avatar": "string (URL)",
      "friends": ["string"]
    }
    ```

* * * * *

### 3\. **Login**

- **Endpoint:** ```/user/login/```
- **Method:** ```POST```
- **Description:** User login.

#### Request

- **Body:**

    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

#### Example Request

```http
POST /users/login HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer <token>

{
    "username": "johndoe",
    "password": "securepassword123"
}
```

* * * * *

Common Error Responses
----------------------

For all requests:

- **Status:** ```400 Bad Request```
- **Body:**

    ```json
    {
      "non_field_errors": [
        "Error message describing the issue"
      ],
      "username": [
        "Error message if username is invalid or already taken"
      ],
      "password": [
        "Error message if password is missing or too weak"
      ]
    }
    ```

* * * * *

Notes
-----

- Passwords should be securely encrypted.
- Ensure unique constraints on usernames and emails.
- Maintain proper validation for fields like email and passwords.
