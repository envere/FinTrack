module.exports = {
  username: "fintrack",
  password: "nfactorialsorting",
  server: "fintrack-snwv2.mongodb.net",
  database: "fintrack_database",
  uri: function(username, password, server, database) {
    return `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`
  },
}