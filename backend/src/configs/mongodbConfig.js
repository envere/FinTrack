module.exports = {
  username: "fintrack",
  password: "nfactorialsorting",
  server: "fintrack-snwv2.mongodb.net",
  database: "fintrack_database",
  uri: `mongodb+srv://${this.username}:${this.password}@${this.server}/${this.database}?retryWrites=true&w=majority`,
}