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
500 => bad request

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
  - `stock/daily/price`
  - `stock/pricerange`
- dividend
  - `dividend/daily/dividend`
  - `dividend/dividendrange`

### auth/register
```
POST
req.body = {
  username: String,   // username
  email: String,         // email
  password: String,   // password
}

res = {
  message: added $username,
  user: {
    _id: String,
    username: String,
  }
}
```
*successful:* 201
*all errors:* 500

### auth/login
```
POST
req.body = {
  username: String,   // username 
  password: String,   // password
}

res = {
  message: authentication passed,
  token: String,         // jwt token
  user: {
    _id: String,
    username: String
  }
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
  users: [{
    _id: String,
    username: username,
    symbols: [{
      symbol: String,
      units: Number,
      initialvalue: Number,
    }]
  }]
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

// if username !== ""
res = {
  message: getting user by username: $username,     
  user: {
    _id: String,
    username: String,
    symbols: [{
      symbol: String,
      units: Number,
      initialvalue: Number,
    }]
  }
}
// if username === ""
res = {
  message: fetching all users since no username in query,
  users: [{
    _id: String,
    username: String,
    symbols: [{
      symbol: String,
      units: Number,
      initialvalue: Number,
    }]
  }]
}
```
*successful:* 200
*token not valid:* 403
*other errors:* 500

### account/deleteaccount
```
POST
req.body = {
  id: String,               // user account document object id
  password: String,   // password
}

res = {
  message: removed $username from database, // user account 
  user: {
    _id: String,
    username: String,
  },
}
```
*successful:* 200
*token not valid / password failed:* 403
*other errors:* 500

### account/symbol/add
```
POST
req.body = {
  id: String,
  symbol: String,
  units: Number,
  initialvalue: Number,
}

// if account did not have this symbol
res = {
  message: added $symbol, $units, $initialvalue to $username,
  user: {
    _id: String,
    username: String,
  },
}
// if account already has symbol
res = {
  message: $symbol is already under $username's account,
  user: {
    _id: String,
    username: String,
  },
}
```
*successful:* 200
*token not valid:* 403
*user account not found*: 404
*other errors:* 500

### account/symbol/update
```
POST
req.body = {
  id: String,
  symbol: String,
  units: Number,
  initialvalue: Number,
}

// if account did not have symbol
res = {
  message: $symbol not saved under $username's account,
  user: {
    _id: String,
    username: String,
  },
}
// if account does have symbol
res = {
  message: updated $symbol, $units, $initialvalue,
  user: {
    _id: String,
    username: String,
  },
}
```
*successful:* 200
*token not valid:* 403
*user account not found*: 404
*other errors:* 500

### account/symbol/delete
```
POST
req.body = {
  id: String,
  symbol: String,
}

res = {
  message: removed $symbol from $username,
  user: {
    _id: String,
    username: String,
  },
}
```
*successful:* 200
*token not valid:* 403
*user account not found*: 404
*other errors:* 500

### stock/intraday/latestprice
```
GET
req.body = {
  symbol: String
}

res = {
  message: latest price $latestprice at time $date (intraday),
  latestprice: {
    date: Date,
    price: Number,
  },
}
```
*successful:* 200
*token not valid:* 403
*price not found:* 404
*other errors:* 500

### stock/daily/price
```
POST
req.body = {
  symbol: String,
  date: String,       // ISO format (YYYY-MM-DD)
}

res = {
  message: getting $symbol price on $date,
  price: {
    date: Date,
    price: Number,
  }
}
```
*successful:* 200
*token not valid:* 403
*price not found:* 404
*other errors:* 500


### stock/pricerange
```
POST
req.body = {
  symbol: String,
  start: String,      // ISO format (YYYY-MM-DD)
  end: String,        // ISO format (YYYY-MM-DD)
}

res = {
  message: $symbol prices from $start to $end,
  prices: [{
    date: Date,
    price: Number,
  }]
}
```
*successful:* 200
*start > end:* 400
*token not valid:* 403
*other errors:* 500

### dividend/daily/dividend
```
POST
req.body = {
  symbol: String,
  date: String,       // ISO format (YYYY-MM-DD)
}

res = {
  message: getting $symbol dividend on $date,
  dividend: {
    date: Date,
    dividend: Number,
  }
}
```
*successful:* 200
*token not valid:* 403
*price not found:* 404
*other errors:* 500

### dividend/dividendrange
```
POST
req.body = {
  symbol: String,
  start: String,    // ISO format (YYYY-MM-DD)
  end: String,    // ISO format (YYYY-MM-DD)
}

res = {
  message: $symbol dividends from $start to $end,
  dividends: {
    days: [{
      date: Date,
      dividend: Number,
    }],
    months: [{
      date: Date,
      dividend: Number,
    }]
  }
}
```
*successful:* 200
*start > end:* 400
*token not valid:* 403
*res.dividends.days === [] && res.dividends.months === []:* 404
*other errors:* 500