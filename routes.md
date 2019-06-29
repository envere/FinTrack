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

**JWT should be in http request Authorization header**

## Routes

### auth

`auth/register`
response will send 400 response if backend messes up, else 201 request is send
```
req.body = {
  username:,
  email:,
  password:,
}
res = {
  message:,
  user:,
}
```

`auth/login`
response will send 404 if user is not found, 403 if password is invalid, 400 if backend messes up, else 200 is send
```
req.body = {
  username:,
  email:,
  password:,
}
res = {
  token:,
}
```


### account

### user
`user/getusers`
`user/getuser`

### stock
`stock/intraday/latestprice`
`stock/daily/latestprice`
`stock/range`