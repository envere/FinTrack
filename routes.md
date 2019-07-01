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
