"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = __importDefault(require("../controllers"));
const getAuthID_1 = __importDefault(require("../middlewares/getAuthID"));
exports.default = (app) => {
    app.get("/api/files", getAuthID_1.default, controllers_1.default.filesController.getMarkDownFileList);
    app.get("/api/get-file-content", getAuthID_1.default, controllers_1.default.filesController.getFileContent);
    app.post("/api/save-file-content", getAuthID_1.default, controllers_1.default.filesController.saveFileContent);
    app.post("/api/file-upload", getAuthID_1.default, controllers_1.default.filesController.uploadFile);
    app.get("/api/backup", getAuthID_1.default, controllers_1.default.filesController.makeDataBackup);
    app.delete("/api/file-delete", getAuthID_1.default, controllers_1.default.filesController.deletedFile);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNSb3V0ZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJyb3V0ZXJzL2ZpbGVzUm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsaUVBQXdDO0FBQ3hDLHlFQUFpRDtBQUlqRCxrQkFBZSxDQUFDLEdBQUcsRUFBQyxFQUFFO0lBQ3BCLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLG1CQUFTLEVBQUUscUJBQVcsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtJQUNqRixHQUFHLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLG1CQUFTLEVBQUUscUJBQVcsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDdkYsR0FBRyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0lBRTFGLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUkvRSxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRzdFLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUVwRixDQUFDLENBQUEifQ==