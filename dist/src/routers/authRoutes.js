"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = __importDefault(require("../controllers"));
const getAuthID_1 = __importDefault(require("../middlewares/getAuthID"));
exports.default = (app) => {
    app.post("/api/auth/login", controllers_1.default.authController.loginUser);
    app.get("/api/users", controllers_1.default.authController.getUser);
    app.get("/api/auth/current-auth", controllers_1.default.authController.loginViaToken);
    app.post("/api/auth/users", controllers_1.default.authController.createNewUser);
    app.post("/api/add-cookie", controllers_1.default.authController.cookieAdd);
    app.get("/api/backup", getAuthID_1.default, controllers_1.default.authController.makeDataBackup);
    app.post("/api/upload-profile-photo", getAuthID_1.default, controllers_1.default.authController.uploadProfilePhoto);
    app.post("/api/upload-profile-cover-photo", getAuthID_1.default, controllers_1.default.authController.uploadProfileCoverPhoto);
    app.post("/api/upload-markdown-image", getAuthID_1.default, controllers_1.default.authController.uploadMarkdownImage);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yb3V0ZXJzL2F1dGhSb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxpRUFBd0M7QUFDeEMseUVBQWlEO0FBRWpELGtCQUFlLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFDcEIsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNqRSxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN6RCxHQUFHLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQzNFLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFckUsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUVqRSxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRTVFLEdBQUcsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBQy9GLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0lBRTFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRW5HLENBQUMsQ0FBQSJ9