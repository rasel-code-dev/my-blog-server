"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers = __importStar(require("../controllers"));
const getAuthID_1 = __importDefault(require("../middlewares/getAuthID"));
exports.default = (app) => {
    app.post("/api/auth/login", controllers.default.authController.loginUser);
    app.get("/api/users/:id", controllers.default.authController.getUser);
    app.get("/api/auth/current-auth", controllers.default.authController.loginViaToken);
    app.post("/api/auth/users", controllers.default.authController.createNewUser);
    app.post("/api/add-cookie", controllers.default.authController.cookieAdd);
    app.post("/api/upload-profile-photo", getAuthID_1.default, controllers.default.authController.uploadProfilePhoto);
    app.post("/api/upload-profile-cover-photo", getAuthID_1.default, controllers.default.authController.uploadProfileCoverPhoto);
    app.post("/api/upload-markdown-image", getAuthID_1.default, controllers.default.authController.uploadMarkdownImage);
    app.post("/api/update-profile", getAuthID_1.default, controllers.default.authController.updateProfile);
    app.get("/api/get-auth-password", getAuthID_1.default, controllers.default.authController.getAuthPassword);
    app.post("/api/auth/send/mail", controllers.default.authController.sendPasswordResetMail);
    app.post("/api/auth/password-reset-session-check", controllers.default.authController.checkPasswordResetSessionTimeout);
    app.post("/api/auth/reset-password", controllers.default.authController.changePassword);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInJvdXRlcnMvYXV0aFJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSw0REFBNkM7QUFDN0MseUVBQWlEO0FBRWpELGtCQUFlLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFDcEIsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUV6RSxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRXJFLEdBQUcsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDbkYsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUU3RSxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBR3pFLEdBQUcsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBQ3ZHLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0lBRWxILEdBQUcsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBRXpHLEdBQUcsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUU1RixHQUFHLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLG1CQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUE7SUFFaEcsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBRXpGLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0NBQXdDLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtJQUd2SCxHQUFHLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBSXpGLENBQUMsQ0FBQSJ9