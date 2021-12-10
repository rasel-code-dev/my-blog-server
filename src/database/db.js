const low = require('lowdb')
const FileSync = require("lowdb/adapters/FileSync");
const db = low(new FileSync("./src/database/db.json"))


export default db