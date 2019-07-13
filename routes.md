# Routes

## Unprotected vs Protected
Unprotected routes do not require JWT in the http request for the backend to give a valid response.
Protected routes requires JWT in the http request for the backend to give a valid response.

For protected routes, invalid or non existent JWT will result in a 403 response from backend.
If you receive 401, access token is invalid, use `auth/refresh` to get a new access token by using your refresh token.

## Status Codes
200 => ok\
201 => resource created\
400 => bad request\
401 => not authorized\
403 => forbidden\
404 => resource not found\
500 => bad request\

**JWT should be in http request Authorization header**
`req.headers['authorization] = <token>`

## Routes
- auth
  - `auth/register`
  - `auth/login`
  - `auth/refresh`
- user
  - `user/getusers`
  - `user/getuser`
- account
  - `account/deleteaccount`
- stock
  - `stock/intraday/latestprice`
  - `stock/daily/price`
  - `stock/pricerange`
- dividend
  - `dividend/daily/dividend`
  - `dividend/dividendrange`
- transaction
  - `transaction/get`
  - `transaction/add`
  - `transaction/delete`
  - `transaction/update`

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

### auth/refresh
```
req.body = {
  _id: String,
}

// if refresh token expiring before new access token
res = {
  accesstoken: String,
  refreshtoken: String,
}
// if refresh token is still valid after next access token
res = {
  accesstoken: String,
}
```

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

### account/deleteaccount
```
POST
req.body = {
  _id: String,               // user account document object id
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

### transaction/get
```
req.body = {
  userid: String,     // _id from user account
}

res = {
  message: getting transactions from $userid,
  transaction: {
    _id: String,            // take note this is transactionid used for delete and update routes
    userid: String,
    history: [{
      _id: String,
      units: Number,
      price: Number,
      tradeValue: Number,
      category: String,
      date: Date,
      symbol: String,
    }]
  }
} 
```

### transaction/add
```
req.body = {
  userid: String,       // _id from user account
  date: String,         // ISO format
  category: String,     // BUY / SELL etc
  symbol: String,       // stock symbol
  units: Number,        // number of units
  price: Number,        // price
  tradeValue: Number,   // tradevalue
}

res = {
  message: added transaction,
  transaction: {
    _id: String,            // take note this is transactionid used for delete and update routes
    userid: String,
    history: [{
      _id: String,
      units: Number,
      price: Number,
      tradeValue: Number,
      category: String,
      date: Date,
      symbol: String,
    }]
  }
}
```

### transaction/delete
```
req.body = {
  userid: String,           // _id from user account
  transactionid: String,    // _id from transaction
}

res = {
  message: added transaction,
  transaction: {
    _id: String,            // take note this is transactionid used for delete and update routes
    userid: String,
    history: [{
      _id: String,
      units: Number,
      price: Number,
      tradeValue: Number,
      category: String,
      date: Date,
      symbol: String,
    }]
  }
}
```

### transaction/update
```
req.body = {
  userid: String,           // _id from user account
  transactionid: String,    // _id from transaction
  units: Number,      [OPTIONAL]
  price: Number,      [OPTIONAL]
  tradeValue: Number, [OPTIONAL]
  category: String,   [OPTIONAL]
  date: Date,         [OPTIONAL]
  symbol: String,     [OPTIONAL]
}

res = {
  message: added transaction,
  transaction: {
    _id: String,            // take note this is transactionid used for delete and update routes
    userid: String,
    history: [{
      _id: String,
      units: Number,
      price: Number,
      tradeValue: Number,
      category: String,
      date: Date,
      symbol: String,
    }]
  }
}
```