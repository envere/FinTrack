module.exports = {
  username: "fintrack",
  password: "fintrack",
  server: "fintrack-j1fap.mongodb.net",
  database: "fintrack_database",
  uri: function (username, password, server, database) {
    return `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`
  },
}