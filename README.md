# Auth

This project provides a user authentication service implemented with NestJS and MongoDB. It includes user registration, login, and role-based access control.

## Features

- **User Registration:** Create a new user with a username, email, and password.
- **User Login:** Authenticate users and generate JWT tokens for session management.
- **Password Hashing:** Secure password storage using PBKDF2 with a cryptographic salt.
- **Role-Based Access Control:** Ensure users have the appropriate permissions to access certain routes.
- **Token Refresh:** Generate and validate refresh tokens for prolonged sessions.

## Installation

### Prerequisites

- Node.js (>=14.x)
- MongoDB (>=4.x)
- npm (>=6.x)

### Steps

1. Clone the repository:

   ```sh
   git clone https://github.com/Phastboy/auth.git
   cd auth
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.example` for the required variables.

4. Start the MongoDB server:

   ```sh
   mongod
   ```

5. Run the application:

   ```sh
   npm run start:dev
   ```

## Usage

### Endpoints

- **Register a new user:**

  ```http
  POST /auth/register
  ```

- **Login a user:**

  ```http
  POST /auth/login
  ```

- **Refresh token:**

  ```http
  POST /auth/refresh
  ```

### Example Requests

#### Register

```sh
curl -X POST http://localhost:3000/auth/register \
-H 'Content-Type: application/json' \
-d '{
  "username": "exampleuser",
  "email": "user@example.com",
  "password": "password123"
}'
```

#### Login

```sh
curl -X POST http://localhost:3000/auth/login \
-H 'Content-Type: application/json' \
-d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

## Running Tests

To run the tests, use the following commands:

- Unit tests:

  ```sh
  npm run test
  ```

- End-to-end tests:

  ```sh
  npm run test:e2e
  ```

- Test coverage:

  ```sh
  npm run test:cov
  ```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes (`git checkout -b feature`).
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature`).
6. Open a pull request.
