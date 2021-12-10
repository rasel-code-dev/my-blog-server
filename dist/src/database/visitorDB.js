
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const visitorDB = low(new FileSync("./src/database/visitor.db.json"))


export default visitorDB