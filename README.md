# Users-Service

Make a POST request to /register and /login routes to Register and Login a user.

/users and /users/:id routes are only allowed for an Admin to access.

## Register example body

{
    "email": "test@test.com",
    "password": "test",
    "displayName": "Test",
    "userRole": "user"
}

## Login example body

{
    "email": "test@test.com",
    "password": "test"
}
