"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = __importDefault(require("../controllers"));
const getAuthID_1 = __importDefault(require("../middlewares/getAuthID"));
exports.default = (app) => {
    app.post("/api/auth/login", controllers_1.default.authController.loginUser);
    app.get("/api/users/:id", controllers_1.default.authController.getUser);
    app.get("/api/auth/current-auth", controllers_1.default.authController.loginViaToken);
    app.post("/api/auth/users", controllers_1.default.authController.createNewUser);
    app.post("/api/add-cookie", controllers_1.default.authController.cookieAdd);
    app.post("/api/upload-profile-photo", getAuthID_1.default, controllers_1.default.authController.uploadProfilePhoto);
    app.post("/api/upload-profile-cover-photo", getAuthID_1.default, controllers_1.default.authController.uploadProfileCoverPhoto);
    app.post("/api/upload-markdown-image", getAuthID_1.default, controllers_1.default.authController.uploadMarkdownImage);
    app.post("/api/update-profile", getAuthID_1.default, controllers_1.default.authController.updateProfile);
    app.get("/api/get-auth-password", getAuthID_1.default, controllers_1.default.authController.getAuthPassword);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInJvdXRlcnMvYXV0aFJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLGlFQUF3QztBQUN4Qyx5RUFBaUQ7QUFFakQsa0JBQWUsQ0FBQyxHQUFHLEVBQUMsRUFBRTtJQUNwQixHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBRWpFLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFN0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUMzRSxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBRXJFLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUE7SUFHakUsR0FBRyxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFDL0YsR0FBRyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUE7SUFFMUcsR0FBRyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFFakcsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBRXBGLEdBQUcsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUkxRixDQUFDLENBQUEifQ==