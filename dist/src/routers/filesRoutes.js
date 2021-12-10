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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNSb3V0ZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcm91dGVycy9maWxlc1JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLGlFQUF3QztBQUN4Qyx5RUFBaUQ7QUFJakQsa0JBQWUsQ0FBQyxHQUFHLEVBQUMsRUFBRTtJQUNwQixHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFDakYsR0FBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ3ZGLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUUxRixHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLG1CQUFTLEVBQUUscUJBQVcsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUE7SUFJL0UsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUc3RSxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLG1CQUFTLEVBQUUscUJBQVcsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUE7QUFFcEYsQ0FBQyxDQUFBIn0=