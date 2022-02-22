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
exports.deletedFile = exports.uploadFile = exports.getMarkDownFileList = exports.getDBFileList = exports.saveFileContent = exports.getFileContent = exports.makeDataBackup = void 0;
const response_1 = __importDefault(require("../response"));
const fs_1 = __importStar(require("fs"));
const formidable_1 = __importDefault(require("formidable"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const replaceOriginalFilename_1 = __importDefault(require("../utilities/replaceOriginalFilename"));
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const dropbox_1 = require("../dropbox");
const makeDataBackup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function createBackup() {
        return new Promise((s, e) => __awaiter(this, void 0, void 0, function* () {
            var archiver = require('archiver');
            const archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });
            // good practice to catch warnings (ie stat failures and other non-blocking errors)
            archive.on('warning', function (err) {
                if (err.code === 'ENOENT') {
                    // log warning
                }
                else {
                    (0, errorConsole_1.default)(err);
                    // response(res, 500, err.message)
                    res.end();
                    // throw error
                    throw err;
                }
            });
            // good practice to catch this error explicitly
            archive.on('error', function (err) {
                (0, errorConsole_1.default)(err);
                res.end();
                // response(res, 500, err.message)
                // throw err;
            });
            // pipe archive data to the file
            archive.pipe(res);
            // append a file from stream
            try {
                let files = yield (0, promises_1.readdir)(path_1.default.resolve("src/markdown"));
                let dir = path_1.default.resolve("src/markdown");
                files.forEach((fileName, i) => {
                    (function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                let fileStats = yield (0, promises_1.stat)(path_1.default.join(dir, fileName));
                                if (fileStats.isFile()) {
                                    let stream = (0, fs_1.createReadStream)(path_1.default.join(dir, fileName));
                                    archive.append(stream, { name: fileName });
                                }
                                if ((i + 1) >= files.length) {
                                    archive.finalize();
                                }
                            }
                            catch (ex) {
                                (0, errorConsole_1.default)(ex);
                                // response(res, 500, ex.message)
                                res.end();
                                e(new Error(ex.message));
                            }
                        });
                    }());
                });
            }
            catch (ex) {
                (0, errorConsole_1.default)(ex);
                res.end();
                // response(res, 500, ex.message)
                e(new Error(ex.message));
            }
        }));
    }
    yield createBackup();
});
exports.makeDataBackup = makeDataBackup;
const getFileContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filePath = req.query.path;
    try {
        if (filePath) {
            let a = yield (0, promises_1.stat)(filePath);
            if (a) {
                // const content = await readFile(filePath)
                let stream = fs_1.default.createReadStream(path_1.default.resolve(filePath));
                stream.pipe(res);
                stream.on("error", () => {
                    (0, response_1.default)(res, 404, {
                        message: "stream error on " + filePath
                    });
                });
            }
            else {
                (0, response_1.default)(res, 404, {
                    message: "file not found with path " + filePath
                });
            }
        }
        else {
            (0, response_1.default)(res, 404, {
                message: "file not found with path " + filePath
            });
        }
    }
    catch (ex) {
        (0, response_1.default)(res, 404, {
            message: ex.message
        });
    }
    // for (const file of mdFiles) {
    //   let a = await stat(MDDirpath() + "/" +  file)
    //   mdFilesD.push({
    //     dir: a.isDirectory(),
    //     modifyTime: a.mtime,
    //     name: file,
    //     path: MDDirpath() + "/" +  file,
    //     size: a.size
    //   })
    // }
    //
});
exports.getFileContent = getFileContent;
const saveFileContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let info = yield (0, promises_1.stat)(req.body.path);
        if (info) {
            yield (0, promises_1.writeFile)(req.body.path, JSON.stringify(req.body.data, undefined, 2));
            (0, response_1.default)(res, 201, { message: "this file are updated" });
        }
    }
    catch (ex) {
        (0, response_1.default)(res, 500, ex.message);
    }
});
exports.saveFileContent = saveFileContent;
const getDBFileList = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let mdPath = "/Apps/markdown-static";
            let files = yield (0, dropbox_1.getFiles)(mdPath);
            if (files) {
                let updatedFiles = files.map(file => {
                    return {
                        dir: file['.tag'] !== "file",
                        name: file.name,
                        path: file.path_lower.slice(1),
                        size: file.size,
                        modifyTime: file.client_modified
                    };
                });
                resolve(updatedFiles);
            }
        }
        catch (ex) {
            resolve([]);
        }
    }));
});
exports.getDBFileList = getDBFileList;
const getMarkDownFileList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let files = yield (0, exports.getDBFileList)();
    if (files) {
        (0, response_1.default)(res, 201, files);
    }
});
exports.getMarkDownFileList = getMarkDownFileList;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const form = (0, formidable_1.default)({ multiples: true });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return (0, response_1.default)(res, 500, {
                message: "File upload fail. " + err.message
            });
        }
        try {
            if (fields.dirType === "markdown") {
                let { newPath, name } = yield (0, replaceOriginalFilename_1.default)(files, "markdown");
                let uploadedPath = path_1.default.resolve("src/markdown/" + name);
                yield (0, promises_1.cp)(newPath, uploadedPath, { force: true });
                (0, response_1.default)(res, 201, {
                    message: "Markdown File upload Success",
                    uploadedPath: uploadedPath
                });
            }
        }
        catch (ex) {
            (0, response_1.default)(res, 500, {
                message: "File upload fail" + ex.message
            });
        }
    }));
});
exports.uploadFile = uploadFile;
const deletedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filePath = req.body.path;
    try {
        let file = yield (0, dropbox_1.deleteFile)(filePath);
        if (file) {
            return (0, response_1.default)(res, 201, "file deleted");
        }
        else {
            return (0, response_1.default)(res, 500, "file are not deleted");
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, {
            message: "File upload fail" + ex.message
        });
    }
});
exports.deletedFile = deletedFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY29udHJvbGxlcnMvZmlsZXNDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMseUNBQXFEO0FBQ3JELDREQUFvQztBQUNwQyxnREFBd0I7QUFFeEIsMENBQXVFO0FBQ3ZFLG1HQUEyRTtBQUMzRSwwRUFBa0Q7QUFDbEQsd0NBQWdEO0FBRXpDLE1BQU0sY0FBYyxHQUFJLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFO0lBQy9DLFNBQVMsWUFBWTtRQUNuQixPQUFPLElBQUksT0FBTyxDQUFDLENBQU8sQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFO1lBRS9CLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVuQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFO2dCQUM5QixJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsOEJBQThCO2FBQ2hELENBQUMsQ0FBQztZQUVULG1GQUFtRjtZQUM3RSxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFVLEdBQUc7Z0JBQ2pDLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7b0JBQ3pCLGNBQWM7aUJBQ2Y7cUJBQU07b0JBQ0wsSUFBQSxzQkFBWSxFQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNqQixrQ0FBa0M7b0JBQ2xDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtvQkFDVCxjQUFjO29CQUNkLE1BQU0sR0FBRyxDQUFDO2lCQUNYO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFVCwrQ0FBK0M7WUFDekMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxHQUFHO2dCQUMvQixJQUFBLHNCQUFZLEVBQUMsR0FBRyxD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