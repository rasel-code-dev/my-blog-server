"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = __importDefault(require("../controllers"));
exports.default = (app) => {
    app.get("/", controllers_1.default.appAdminController.getHomePage);
    app.post("/admin/login", controllers_1.default.appAdminController.adminLogin);
    app.post("/admin/upload/file", controllers_1.default.appAdminController.uploadDatabaseFile);
    // app.get("/api/auth/current-auth", controllers.authController.loginViaToken)
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwQWRtaW5Sb3V0ZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcm91dGVycy9hcHBBZG1pblJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLGlFQUF3QztBQUd4QyxrQkFBZSxDQUFDLEdBQUcsRUFBQyxFQUFFO0lBQ3BCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFXLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDeEQsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNuRSxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLHFCQUFXLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtJQUNqRiw4RUFBOEU7QUFHaEYsQ0FBQyxDQUFBIn0=