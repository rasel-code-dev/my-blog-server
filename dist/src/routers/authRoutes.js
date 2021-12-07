"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = __importDefault(require("../controllers"));
exports.default = (app) => {
    app.post("/api/auth/login", controllers_1.default.authController.loginUser);
    app.get("/api/users", controllers_1.default.authController.getUser);
    app.get("/api/auth/current-auth", controllers_1.default.authController.loginViaToken);
    app.post("/api/auth/users", controllers_1.default.authController.createNewUser);
    app.post("/api/add-cookie", controllers_1.default.authController.cookieAdd);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yb3V0ZXJzL2F1dGhSb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxpRUFBd0M7QUFFeEMsa0JBQWUsQ0FBQyxHQUFHLEVBQUMsRUFBRTtJQUNwQixHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ2pFLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3pELEdBQUcsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDM0UsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUVyRSxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRW5FLENBQUMsQ0FBQSJ9