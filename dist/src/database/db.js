"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const low = require('lowdb');
const FileSync = require("lowdb/adapters/FileSync");
const db = low(new FileSync("./src/database/db.json"));
exports.default = db;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZGF0YWJhc2UvZGIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDNUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQTtBQUd0RCxrQkFBZSxFQUFFLENBQUEifQ==