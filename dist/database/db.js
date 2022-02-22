"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const low = require('lowdb');
const FileSync = require("lowdb/adapters/FileSync");
const db = low(new FileSync("./src/database/db.json"));
exports.default = db;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJkYXRhYmFzZS9kYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM1QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNwRCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFBO0FBR3RELGtCQUFlLEVBQUUsQ0FBQSJ9