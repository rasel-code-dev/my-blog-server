"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postRoutes_1 = __importDefault(require("./postRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const filesRoutes_1 = __importDefault(require("./filesRoutes"));
const appAdminRoutes_1 = __importDefault(require("./appAdminRoutes"));
function routes(app) {
    (0, postRoutes_1.default)(app);
    (0, authRoutes_1.default)(app);
    (0, filesRoutes_1.default)(app);
    (0, appAdminRoutes_1.default)(app);
}
exports.default = routes;
module.exports = routes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJyb3V0ZXJzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsOERBQXNDO0FBQ3RDLDhEQUFzQztBQUN0QyxnRUFBd0M7QUFDeEMsc0VBQThDO0FBRTlDLFNBQVMsTUFBTSxDQUFFLEdBQUc7SUFDbEIsSUFBQSxvQkFBVSxFQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBQSxvQkFBVSxFQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBQSxxQkFBVyxFQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2hCLElBQUEsd0JBQWMsRUFBQyxHQUFHLENBQUMsQ0FBQTtBQUNyQixDQUFDO0FBRUQsa0JBQWUsTUFBTSxDQUFBO0FBQ3JCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBIn0=