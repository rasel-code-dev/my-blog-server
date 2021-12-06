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
                    yield (0, promises_1.copyFile)(file.path, newPath);
                    newFiles.push({
                        name: file.name,
                        path: newPath
                    });
                    if (newFiles.length >= 2) {
                        callback(false, { fields, files: { [fieldName]: newFiles } });
                    }
                    fs_1.default.rm(file.path, (err) => { });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZVVwbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy91dGlsaXRpZXMvZmlsZVVwbG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLDREQUFvQztBQUNwQywwQ0FBd0Q7QUFDeEQsNENBQW1CO0FBRW5CLDBCQUEwQjtBQUUxQixTQUFTLFVBQVUsQ0FBQyxHQUFZLEVBQUUsUUFBZ0IsRUFBRSxTQUFpQixFQUFFLFFBQTBDO0lBQy9HLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQTtJQUUxQixZQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBQyxFQUFFO1FBQ3hCLElBQUcsR0FBRyxFQUFDO1lBQ0gsSUFBQSxnQkFBSyxFQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFFLEVBQUU7Z0JBQ3hCLFdBQVc7Z0JBQ1gsaUJBQWlCLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDeEQsQ0FBQyxDQUFDLENBQUE7U0FDTDthQUFNO1lBQ0QsV0FBVztZQUNiLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1NBQ3ZEO0lBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFTixDQUFDO0FBT0QsU0FBUyxpQkFBaUIsQ0FBQyxHQUFZLEVBQUUsU0FBaUIsRUFBRSxTQUFpQixFQUFFLFFBQTBDO0lBRXJILE1BQU0sSUFBSSxHQUFHLElBQUEsb0JBQVUsRUFBQyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO0lBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBRTtRQUUxQyxJQUFHLEdBQUcsRUFBQztZQUNMLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDakIsT0FBTTtTQUNQO1FBR0QsSUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7WUFHL0IsSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDO2dCQUVqQyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUE7Z0JBQ2pCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUE7Z0JBRWpDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBTyxJQUFJLEVBQUUsQ0FBQyxFQUFDLEVBQUU7b0JBQ3BDLGlCQUFpQjtvQkFDakIsSUFBSSxPQUFPLEdBQUcsU0FBUyxHQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFBO29CQUNyQyxNQUFNLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBO29CQUNsQyxRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUNaLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTt3QkFDZixJQUFJLEVBQUUsT0FBTztxQkFDZCxDQUFDLENBQUE7b0JBQ0YsSUFBRyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBQzt3QkFDdEIsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQTtxQkFDNUQ7b0JBQ0QsWUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFFN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTthQUNIO2lCQUNHO2dCQUNGLElBQUksT0FBTyxHQUFHLFNBQVMsR0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixDQUFBO2dCQUM3RCxNQUFNLElBQUEsbUJBQVEsRUFBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO2dCQUNsRCxJQUFJLElBQUksR0FBRztvQkFDVCxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQjtvQkFDdkMsSUFBSSxFQUFFLE9BQU87aUJBQ2QsQ0FBQTtnQkFDRCxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQTtnQkFDekQsWUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsQ0FBQTthQUM1QztTQUVGO2FBQU07WUFFTCxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1NBQ3pDO0lBRUgsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFHSCxrQkFBZSxVQUFVLENBQUEifQ==