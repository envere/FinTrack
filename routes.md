# Routes

## Unprotected Routes
- auth

## Protected Routes
- account
- user
- stock

## Unprotected vs Protected
Unprotected routes do not require JWT in the http request for the backend to give a valid response.
Protected routes requires JWT in the http request for the backend to give a valid response.

For protected routes, invalid or non existent JWT will result in a 403 response from backend.

## Status Codes
200 => ok
201 => resource created
400 => bad request
403 => forbidden
404 => resource not found

**JWT should be in http request Authorization header**
`req.headers['authorization] = <token>`

## Routes
- auth
  - `auth/register`
  - `auth/login`
- user
  - `user/getusers`
  - `user/getuser`
- account
  - `account/deleteaccount`
  - `account/symbol/add`
  - `account/symbol/delete`
  - `account/symbol/update`
- stock
  - `stock/intraday/latestprice`
  - `stock/daily/latestprice`
  - `stock/pricerange`

### auth/register
```
POST
req.body = {
  username: username,   // username
  email: email,         // email
  password: password,   // password
}

res = {
  message: added $username,
  user: user,           // user document
}
```
*successful:* 201
*all errors:* 500

### auth/login
```
POST
req.body = {
  username: username,   // username 
  password: password,   // password
}

res = {
  message: authentication passed,
  token: token,         // jwt token
  user: user,           // user document
}
```
*successful:* 200
*token not valid:* 403
*other errors:* 500

### user/getusers
```
GET

res = {
  message: list of all users,
  users: [user]         // array of all user documents
}
```
*successful:* 200
*token not valid:* 403
*other errors:* 500

### user/getuser
```
GET

req.query = {
  username: username,
}

// if username === ""
res = {
  message: getting user by username: $username,     
  user: user            // user document
}
// if username !== ""
res = {
  message: fetching all users since no username in query,
  users: users          // array of all user documents
}
```
*successful:* 200
*token not valid:* 403
*other errors:* 500