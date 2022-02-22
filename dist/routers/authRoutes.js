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
    app.get("/api/auth/user/:email", controllers.default.authController.getUserEmail);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInJvdXRlcnMvYXV0aFJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSw0REFBNkM7QUFDN0MseUVBQWlEO0FBRWpELGtCQUFlLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFDcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUVqRixHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3pFLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFckUsR0FBRyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUNuRixHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBRTdFLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUE7SUFHekUsR0FBRyxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxtQkFBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFDdkcsR0FBRyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxtQkFBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUE7SUFFbEgsR0FBRyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxtQkFBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFFekcsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxtQkFBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBRTVGLEdBQUcsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUVoRyxHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUE7SUFFekYsR0FBRyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0lBR3ZILEdBQUcsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUE7QUFJekYsQ0FBQyxDQUFBIn0=