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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwQWRtaW5Sb3V0ZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJyb3V0ZXJzL2FwcEFkbWluUm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsaUVBQXdDO0FBR3hDLGtCQUFlLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFDcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUN4RCxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ25FLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBQ2pGLDhFQUE4RTtBQUdoRixDQUFDLENBQUEifQ==