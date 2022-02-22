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
    app.get("/api/files", getAuthID_1.default, controllers.default.filesController.getMarkDownFileList);
    app.get("/api/get-file-content", getAuthID_1.default, controllers.default.filesController.getFileContent);
    app.post("/api/save-file-content", getAuthID_1.default, controllers.default.filesController.saveFileContent);
    app.post("/api/file-upload", getAuthID_1.default, controllers.default.filesController.uploadFile);
    app.get("/api/backup", getAuthID_1.default, controllers.default.filesController.makeDataBackup);
    app.post("/api/file-delete", getAuthID_1.default, controllers.default.filesController.deletedFile);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNSb3V0ZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJyb3V0ZXJzL2ZpbGVzUm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDREQUE2QztBQUM3Qyx5RUFBaUQ7QUFJakQsa0JBQWUsQ0FBQyxHQUFHLEVBQUMsRUFBRTtJQUNwQixHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxtQkFBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFDekYsR0FBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxtQkFBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQy9GLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUVsRyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLG1CQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUE7SUFJdkYsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUdyRixHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLG1CQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUE7QUFFMUYsQ0FBQyxDQUFBIn0=