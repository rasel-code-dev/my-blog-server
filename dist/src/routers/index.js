"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postRoutes_1 = __importDefault(require("./postRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
function routes(app) {
    (0, postRoutes_1.default)(app);
    (0, authRoutes_1.default)(app);
}
exports.default = routes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcm91dGVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDhEQUFxQztBQUNyQyw4REFBc0M7QUFFdEMsU0FBUyxNQUFNLENBQUUsR0FBRztJQUNsQixJQUFBLG9CQUFVLEVBQUMsR0FBRyxDQUFDLENBQUE7SUFDZixJQUFBLG9CQUFVLEVBQUMsR0FBRyxDQUFDLENBQUE7QUFDakIsQ0FBQztBQUVELGtCQUFlLE1BQU0sQ0FBQSJ9