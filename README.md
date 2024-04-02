# Project OzMaptest

## Description

This is a technical assessment project for OzMap. It includes functionalities to manage users and regions using Node.js, MongoDB, and Typescript.

## Installation

1. Clone this repository:

   ```
   git clone git@github.com:ozmap/technical-assessment-int_dm.git
   ```

2. Install the dependencies:

   ```
   cd technical-assessment-int_dm
   npm install
   ```

## Configuration

1. Make sure Docker is installed.
2. Create a `.env` file in the root of the project and add necessary environment variables, such as `MONGO_URI`.

## Usage

### Development

To start the server in development mode:

```
npm run dev
```

### Running the Project with Docker Container

To start the server in the container:

```
docker-compose up
```

### Testing

To run the tests:

```
npm test
```

## Features

### Users

- Each user has the following attributes:
  - `name`: User's name.
  - `email`: User's email address.
  - `address`: User's address.
  - `coordinates`: User's geographical coordinates.
- When creating a user, it's possible to provide either the address OR the coordinates. Providing both or neither will result in an error response.
- Coordinate resolution from an address and vice versa is performed using a geolocation service.
- Updating the address or coordinates follows the same logic as creation.

#### Routes

- `GET /users`: Returns all registered users.
- `GET /users/:id`: Returns a specific user based on the provided ID.
- `POST /users`: Creates a new user with the data provided in the request body.
- `PUT /users/:id`: Updates an existing user based on the provided ID, using the data provided in the request body.
- `DELETE /users/:id`: Deletes an existing user based on the provided ID.

### Regions

- Each region has the following attributes:
  - `name`: Region's name.
  - `coordinates`: Geographical coordinates defining the area of the region.
  - `user`: ID of the user who owns the region.
- It's possible to list regions containing a specific point by providing the coordinates of that point.

#### Routes

- `GET /regions`: Returns all registered regions.
- `GET /regions/:id`: Returns a specific region based on the provided ID.
- `POST /regions`: Creates a new region with the data provided in the request body.
- `PUT /regions/:id`: Updates an existing region based on the provided ID, using the data provided in the request body.
- `DELETE /regions/:id`: Deletes an existing region based on the provided ID.
- `GET /regions/contains`: Returns all regions containing a specific point, provided as a query parameter.

## Request Examples

Here are example curl requests:

**Users**
- `GET /users`
```bash
curl --location --request GET 'http://localhost:3003/users/'
```
- `GET /users/:id`
```bash
curl --location --request GET 'http://localhost:3003/users{userId}'
```
- `POST /users` with adress
```bash
curl --location --request POST 'http://localhost:3003/users' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "231 wall street"
}'
```
- `POST /users` with coordinates
```bash
curl --location --request POST 'http://localhost:3003/users' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "John Doe",
  "email": "john@example.com",
  "coordinates": [40.7128, -74.0060]
}'
```
- `PUT /users/:id`
```bash
curl --location --request PUT 'http://localhost:3003/users/{userId}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "address": "wall street 221"
}'
```
- `DELETE /users/:id`
```bash
curl --location --request DELETE 'http://localhost:3003/users/{userId}'
```

**Regions**
- `GET /regions`
```bash
curl --location --request GET 'http://localhost:3003/regions'
```
- `GET /regions/:id`
```bash
curl --location --request GET 'http://localhost:3003/regions{regionId}'
```
- `POST /regions`
```bash
curl --location --request POST 'http://localhost:3003/regions' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Central Park",
  "coordinates": [[40.785091, -73.968285], [40.800207, -73.9543], [40.785091, -73.936285], [40.765191, -73.9543]],
  "userId": ":id"
}'
```
- `PUT /regions/:id`
```bash
curl --location --request PUT 'http://localhost:3003/regions/{regionId}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Updated Region Name",
  "coordinates": [[40.785091, -73.968285], [40.800207, -73.9543], [40.785091, -73.936285], [40.765191, -73.9543]]
}'
```
- `DELETE /regions/:id`
```bash
curl --location --request DELETE 'http://localhost:3003/regions/{regionId}'
```
- `GET /regions/contains`
```bash
curl --location --request GET 'http://localhost:3003/regions/contains?point=40.785091,-73.968285' \
--header 'Content-Type: application/json'
```

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.
