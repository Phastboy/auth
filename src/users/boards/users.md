# User Registration

To create a new user, we need the following components:

- **User Schema:** Defines the structure of the user object.
- **User Model:** Interacts with the database and performs CRUD operations.
- **User Service:** Contains logic for creating a new user.

## User Entity

```mermaid
erDiagram
    User {
      int id
      string name
      string email
      string password
      string salt
      string role
      string createdAt
      string updatedAt
    }
    Seller {
      int id
      string storeName
      string storeDescription
      object[] products
    }
    Seller ||--o{ User : "extends"
```

## User Registration Process

```mermaid
sequenceDiagram
    participant Client
    participant UsersService
    participant Database

    Client->>UsersService: create(createUserDto)
    UsersService->>UsersService: log(createUserDto)
    UsersService->>UsersService: new User(createUserDto)
    UsersService->>Database: save()
    Database-->>UsersService: savedUser
    UsersService-->>Client: savedUser
```

<!---->
<!-- role===admin differentiate the admin and the user. -->
<!---->
<!-- an admin can create, update, delete a user -->

```

```
