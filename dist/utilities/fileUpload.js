"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = __importDefault(require("formidable"));
const promises_1 = require("fs/promises");
const fs_1 = __importDefault(require("fs"));
// "formidable": "^2.0.1",
function fileUpload(req, filePath, fieldName, callback) {
    const uploadDir = filePath;
    fs_1.default.stat(uploadDir, (err) => {
        if (err) {
            (0, promises_1.mkdir)(uploadDir).then(() => {
                // continue
                fileUploadHandler(req, uploadDir, fieldName, callback);
            });
        }
        else {
            // continue
            fileUploadHandler(req, uploadDir, fieldName, callback);
        }
    });
}
function fileUploadHandler(req, uploadDir, fieldName, callback) {
    const form = (0, formidable_1.default)({ multiples: true });
    form.parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            callback(err, {});
            return;
        }
        if (Object.keys(files).length > 0) {
            if (Array.isArray(files[fieldName])) {
                let newFiles = [];
                let len = files[fieldName].length;
                files[fieldName].map((file, i) => __awaiter(this, void 0, void 0, function* () {
                    // item = (i + 1)
                    let newPath = uploadDir + "/" + file.name;
                    try {
                        yield (0, promises_1.copyFile)(file.path, newPath);
                        newFiles.push({
                            name: file.name,
                            path: newPath
                        });
                        if (newFiles.length >= 2) {
                            callback(false, { fields, files: { [fieldName]: newFiles } });
                        }
                        fs_1.default.rm(file.path, (err) => {
                        });
                    }
                    catch (ex) {
                        console.log(ex.message);
                    }
                }));
            }
            else {
                let newPath = uploadDir + "/" + files[fieldName].originalFilename;
                yield (0, promises_1.copyFile)(files[fieldName].filepath, newPath);
                let file = {
                    name: files[fieldName].originalFilename,
                    path: newPath
                };
                callback(false, { fields, files: { [fieldName]: [file] } });
                fs_1.default.rm(files[fieldName].filepath, (err) => { });
            }
        }
        else {
            callback(false, { fields, files: false });
        }
    }));
}
exports.default = fileUpload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZVVwbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdGllcy9maWxlVXBsb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNERBQW9DO0FBQ3BDLDBDQUF3RDtBQUN4RCw0Q0FBbUI7QUFFbkIsMEJBQTBCO0FBRTFCLFNBQVMsVUFBVSxDQUFDLEdBQVksRUFBRSxRQUFnQixFQUFFLFNBQWlCLEVBQUUsUUFBMEM7SUFDL0csTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFBO0lBRTFCLFlBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFDLEVBQUU7UUFDeEIsSUFBRyxHQUFHLEVBQUM7WUFFSCxJQUFBLGdCQUFLLEVBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUUsRUFBRTtnQkFDeEIsV0FBVztnQkFDWCxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQTtZQUN4RCxDQUFDLENBQUMsQ0FBQTtTQUNMO2FBQU07WUFDQyxXQUFXO1lBQ2YsaUJBQWlCLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7U0FDdkQ7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUVOLENBQUM7QUFPRCxTQUFTLGlCQUFpQixDQUFDLEdBQVksRUFBRSxTQUFpQixFQUFFLFNBQWlCLEVBQUUsUUFBMEM7SUFFckgsTUFBTSxJQUFJLEdBQUcsSUFBQSxvQkFBVSxFQUFDLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7SUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxFQUFFO1FBRTFDLElBQUcsR0FBRyxFQUFDO1lBQ0wsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUNqQixPQUFN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