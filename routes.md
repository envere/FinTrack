# Routes

## Warning
There are some request and responses that require an _id field.\
_id in the database is actually a ObjectId datatype, however it seems to be converted to string whenever it is sent as a response.\
This might cause bugs that I am not aware of as I assume the _id in requests are strings.\
I recommend whenever you wanna store _id from a response, just save it as it is, then put in the requests when needed.\
If you are getting server side bugs, then instead of sending _id, send _id as _id.toString()\
This is just a precautionary warning as I am not sure how the clientside code gets _id as.\
Therefore just store _id as it is, and use it in requests when needed, if error, try _id.toString() instead.\
**userid in certain routes refer to _id**

### Status Codes
- 200 => ok                   [request was successfully processed]
- 201 => resource created     [request was successful, document created]
- 400 => bad request          [request was buggy, not server's issue]
- 401 => unauthorized         [access token expired, try to request for new access token]
- 403 => forbidden            [access token and refresh token both expired, do not try again, guaranteed to fail, should redirect to login]
- 404 => resource not found   [whatever you are searching for doesnt exist in the server]
- 500 => server side error    [server bug, LMK so i can fix, should not happen unless hosting issue]


## Schemas
- User
- SymbolName
- StockPrice
- DividendPrice
- Blacklist
- Portfolio
- PortfolioHistory
- Transaction

User = {
  username: String,
  email: String,
  password: String,
}

SymbolName = {
  symbol: String,
}

StockPrice = {
  symbol: String,
  year: Number,
  days: [{price: Number, date: Date}]
  months: [{price: Number, date: Date}]
}

DividendPrice = {
  symbol: String,
  year: Number,
  days: [{dividend: Number, date: Date}]
  months: [{dividend: Nymber, date: Date}]
}

Blacklist = {
  userid: String,
  token: String,
  expireAt: Date,
}

Portfolio = {
  userid: String,
  totalCapital: Number,
  totalValue: Number,
  realisedProfits: Number,
  symbols: [{symbol: String, name: String, units: Number, investedCapital: Number, dividends: Number, currentValue: Number}]
}

PortfolioHistory = {
  userid: String,
  year: Number,
  history: [{date: Date, totalCapital: Number, totalValue: Number, realisedProfits: Number}]
}

Transaction = {
  userid: String,
  history = [{category: String, date: Date, symbol: String, units: Number, price: Number, tradeValue: Number}]
}

## Categories
- auth
- account
- dividend
- stock
- portfolio
- transaction
- user

## Authorization
- unprotected => no token necessary
- protected
  - /auth/refresh => use refresh token
  - everything else => use access token

### Auth
- /auth/register
- /auth/login
- /auth/refresh

##### POST /auth/register
This route saves the user account and all related documents (transaction history and portfolio)
```
req.body = {
  username: String,
  email: String,
  password: String,   // plaintext
}

res = {
  message: String,
  user: {
    _id: String,
    username: String,
  }
}
```

##### POST /auth/login
This route logs in the user and sends an access token and refresh token to store
```
req.body = {
  username: String,
  password: String,  // plaintext
}

res = {
  message: String,
  accesstoken: String,    // short exp, use for requests 
  refreshtoken: String,   // long exp, use to get new access token if access token has expired and you encountered a 401
}
```

##### POST /auth/refresh
This route gets a new access token (and possibly a refresh token IF the next access token will expire after your current refresh token expires)\
Store all tokens that you get from response
```
req.body = {
  _id: String,   // user _id from login
}

// if res.accesstoken expires before the current refresh token
res = {
  accesstoken: String,
}
// if res.accesstoken expires after the current refresh token
res = {
  accesstoken = String,
  refreshtoken = String,
}
```

### Account
- /account/deleteaccount
- /account/logout

##### POST /account/deleteaccount
This route deletes the user account, use for account deactivation or debugging.
```
req.body = {
  _id: String,
  password: String,     // plaintext
}

res = {
  message: String,
  user: {
    _id: String,
    username: String,
  }
}
```

##### POST /account/logout
This route logs out the user and blacklists the tokens that is sent in request (because token cannot be revoked/expired after expiration date was set on creation)
```
req.body = {
  _id: String,
  accesstoken: String,
  refreshtoken: String,
}

res = {
  message: String,
}
```

### Dividend
- /dividend/daily/dividend
- /dividend/dividendrange

##### POST /dividend/daily/dividend
This route gets the dividend by date.
```
req.body = {
  symbol: String,
  date: String,   // ISO format
}

res = {
  message: String,
  dividend: {
    date: Date,
    dividend: Number,
  }
}
```

##### POST /dividend/dividendrange
This route gets a range of dividends by date.
```
req.body = {
  symbol: String,
  start: String, // ISO format
  end: String,   // ISO format
}

res = {
  message: String,
  dividends: [{         // array of dividends
    date: Date,
    dividend: Number,
  }]
}
```

### Stock
- /stock/intraday/latestprice
- /stock/daily/price
- /stock/daily/pricerange

##### GET /stock/intraday/latestprice
This route gets the latest price from alphavantage possible.
```
req.body = {
  symbol: String
}

res = {
  message: String,
  latestprice: {
    date: Date,
    price: Number,
  }
}
```

##### POST /stock/daily/price
This route gets stock price by date.
```
req.body = {
  symbol: String,
  date: String,   // ISO format
}

res = {
  message: String,
  price: {
    date: Date,
    price: Number,
  }
}
```

##### POST /stock/pricerange
This route gets a range of prices by date.
```
req.body = {
  symbol: String,
  start: String,
  end: String,
}

res = {
  message: String,
  prices: [{        // array of prices
    date: Date,
    price: Number,
  }]
}
```

### Portfolio
- /portfolio/get
- /portfolio/add
- /portfolio/delete
- /portfolio/update

##### GET /portfolio/get
This route gets a user's portfolio document
```
req.body = {
  userid: String  // user's _id from login
}

res = {
  message: String,
  portfolio: {
    userid: String,
    totalCapital: Number,
    totalValue: Number,
    symbols: [{
      symbol: String,
      name: String,
      units: Number.
      investedCapital: Number,
      dividends: Number,
      currentValue: Number,
    }]
  }
}
```

##### POST /portfolio/add
This route adds the symbol object to portfolio
```
req.body = {
  userid: String,
  symbol: String,
  name: String,
  units: Number,
  investedCapital: Number,
  dividends: Number,
  currentValue: Number,
}

res = {
  message: String,
  portfolio: {
    userid: String,
    totalCapital: Number,
    totalValue: Number,
    symbols: [{
      symbol: String,
      name: String,
      units: Number.
      investedCapital: Number,
      dividends: Number,
      currentValue: Number,
    }]
  }
}
```

##### POST /portfolio/delete
This route deletes the symbol object from user's portfolio
```
req.body = {
  userid: String,
  symbol: String,
}

res = {
  message: String,
  portfolio: {
    userid: String,
    totalCapital: Number,
    totalValue: Number,
    symbols: [{
      symbol: String,
      name: String,
      units: Number.
      investedCapital: Number,
      dividends: Number,
      currentValue: Number,
    }]
  }
}
```

##### POST /portfolio/update
This route updates a symbol object for user's portfolio.
```
req.body = {
  userid: String
  symbol: String
  name: String,             // OPTIONAL
  units: Number,            // OPTIONAL
  investedCapital: Number,  // OPTIONAL
  dividends: Number,        // OPTIONAL
  currentValue: Number,     // OPTIONAL
}

res = {
  message: String,
  portfolio: {
    userid: String,
    totalCapital: Number,
    totalValue: Number,
    symbols: [{
      symbol: String,
      name: String,
      units: Number.
      investedCapital: Number,
      dividends: Number,
      currentValue: Number,
    }]
  }
}
```
##### POST /portfolio/sync
This route updates totalCapital, totalValue, realisedProfits of a user's portfolio
```
req.body = {
  userid: String,
  totalCapital: Number,
  totalValue: Number,
  realisedProfits: Number,
}

res = {
  message: String,
  portfolio: {
    userid: String,
    totalCapital: Number,
    totalValue: Number,
    symbols: [{
      symbol: String,
      name: String,
      units: Number.
      investedCapital: Number,
      dividends: Number,
      currentValue: Number,
    }]
  }
}
```
##### GET /portfolio/logs
This route gets you the history of portfolio stats, totalCapital, totalValue, realisedProfits
```
req.query = {
  userid: String,
  size: Number,       // number of data points
}

res = {
  message: String,
  logs: [{
    date: Date,
    totalCapital: Number,
    totalValue: Number,
    realisedProfits: Number,
  }]
}
```

### Transaction
- /transaction/get
- /transaction/add
- /transaction/delete
- /tranasction/update

##### GET /transaction/get
This route gets the transactions of a user's account
```
req.body = {
  userid: String,
}

res = {
  message: String,
  transaction: {
    userid: String,
    history: [{
      _id: String,
      category: String,
      date: Date,
      symbol: String,
      units: Number,
      price: Number,
      tradeValue: Number,
    }]
  }
}
```

##### POST /transaction/add
This route adds a transaction to a user's transaction history.
```
req.body = {
  userid: String,
  date: String, // ISO format
  category: String,
  symbol: String,
  units: Number,
  price: Number,
  tradeValue: Number,
}

res = {
  message: String,
  transaction: {
    userid: String,
    history: [{
      _id: String
      category: String,
      date: Date,
      symbol: String,
      units: Number,
      price: Number,
      tradeValue: Number,
    }]
  }
}
```

##### POST /transaction/delete
This route deletes a transaction from a user's transaction history.
```
req.body = {
  userid: String
  transactionid: String     // _id from transaction object
}

res = {
  message: String,
  transaction: {
    userid: String,
    history: [{
      _id: String
      category: String,
      date: Date,
      symbol: String,
      units: Number,
      price: Number,
      tradeValue: Number,
    }]
  }
}
```

##### POST /transaction/update
This route deletes a transaction from history
```
req.body = {
  userid: String,
  _id: String,
  categoty: String,     // OPTIONAL
  date: String,         // OPTIONAL
  symbol: String,       // OPTIONAL
  units: Number,        // OPTIONAL
  price: Number,        // OPTIONAL
  tradeValue: Number,   // OPTIONAL
}
```

### User
- /user/getusers
- /user/getuser

##### GET /user/getusers
This route gets all users
```
res = {
  message: String,
  users: [{
    _id: String,
    username: String,
  }]
}
```

##### GET /user/getuser
This route gets user by username
```
req.query = {
  username: String
}

// if no query is provided
res = {
  message: String
  users: [{
    _id: String,
    username: String,
  }]
}
// if query is provided
res = {
  message: String,
  user: {
    _id: String,
    username: String,
  }
}
```