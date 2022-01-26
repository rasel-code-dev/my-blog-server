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
            let mdPath = path_1.default.resolve("src/markdown"); // from project root
            let mdFiles = yield (0, promises_1.readdir)(mdPath);
            let mdFilesD = [];
            for (const file of mdFiles) {
                let a = yield (0, promises_1.stat)(path_1.default.join(mdPath + "/" + file));
                mdFilesD.push({
                    dir: a.isDirectory(),
                    modifyTime: a.mtime,
                    name: file,
                    path: path_1.default.join(mdPath + "/" + file),
                    size: a.size
                });
            }
            resolve({
                markdownFiles: mdFilesD ? mdFilesD : []
            });
        }
        catch (ex) {
            console.log(ex.message);
            resolve({
                markdownFiles: []
            });
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
    let filePath = req.query.path;
    try {
        yield (0, promises_1.rm)(path_1.default.resolve(filePath));
        (0, response_1.default)(res, 201, {
            message: "file deleted",
            deletedPath: filePath
        });
    }
    catch (ex) {
        (0, response_1.default)(res, 500, {
            message: "File upload fail" + ex.message
        });
    }
});
exports.deletedFile = deletedFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY29udHJvbGxlcnMvZmlsZXNDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMseUNBQXFEO0FBQ3JELDREQUFvQztBQUNwQyxnREFBd0I7QUFFeEIsMENBQXVFO0FBQ3ZFLG1HQUEyRTtBQUMzRSwwRUFBa0Q7QUFFM0MsTUFBTSxjQUFjLEdBQUksQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDL0MsU0FBUyxZQUFZO1FBQ25CLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUU7WUFFL0IsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRW5DLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUU7Z0JBQzlCLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQyw4QkFBOEI7YUFDaEQsQ0FBQyxDQUFDO1lBRVQsbUZBQW1GO1lBQzdFLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVUsR0FBRztnQkFDakMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDekIsY0FBYztpQkFDZjtxQkFBTTtvQkFDTCxJQUFBLHNCQUFZLEVBQUMsR0FBRyxDQUFDLENBQUE7b0JBQ2pCLGtDQUFrQztvQkFDbEMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO29CQUNULGNBQWM7b0JBQ2QsTUFBTSxHQUFHLENBQUM7aUJBQ1g7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVULCtDQUErQztZQUN6QyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQUc7Z0JBQy9CLElBQUEsc0JBQVksRUFBQyxHQUFHLENBQUMsQ0FBQTtnQkFD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