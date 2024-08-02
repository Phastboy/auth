# User Registration

To create a new user, follow these steps: generate a salt, hash the user's password, and store the user in the database using the `UsersService` class.

## Steps for Creating a User

1. **Generate Salt Function**

   - Create a function in the `AuthService` class to generate a cryptographic salt. This function is named `generateSalt` and takes a length parameter to determine the length of the generated salt.

2. **Hash Password Function**

   - Create a function in the `AuthService` class to hash a password using the generated salt and the password provided by the client. This function is named `hashPassword` and takes the password and salt as parameters.

3. **Create User Function**
   - Create a function in the `AuthService` class to call the `UsersService` class and create a new user with the hashed password and salt. This function is named `createUser` and takes a `CreateUserDto` object as a parameter.
   - Ensure the user data is validated before creating the user.

### Implementation Details

- Use the `crypto` module to generate the salt and hash the password.
- The `UsersService` class has a `create` method that takes a `CreateUserDto` object, creates a new user document, and saves it to the database.

## User Registration Process

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant UsersService
    participant Database

    Client->>+AuthController: POST /auth/register
    AuthController->>+AuthService: createUser(CreateUserDto)
    AuthService->>+AuthService: generateSalt(length)
    AuthService->>+AuthService: hashPassword(password, salt)
    AuthService->>+UsersService: create(CreateUserDto with hashed password and salt)
    UsersService->>+Database: Store User in the database
    Database-->>-UsersService: User stored
    UsersService-->>-AuthService: User created
    AuthService-->>-AuthController: User creation successful
    AuthController-->>-Client: Respond with created user
```
