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
exports.deletedFile = exports.uploadFile = exports.getMarkDownFileList = exports.getDBFileList = exports.saveFileContent = exports.getFileContent = exports.makeDataBackup = void 0;
const response_1 = __importDefault(require("../response"));
const shortid = require("shortid");
const bcryptjs = require("bcryptjs");
const makeZip_1 = __importDefault(require("../utilities/makeZip"));
const fs_1 = __importDefault(require("fs"));
const formidable_1 = __importDefault(require("formidable"));
const path_1 = __importDefault(require("path"));
const MDPath_1 = require("../utilities/MDPath");
const promises_1 = require("fs/promises");
const replaceOriginalFilename_1 = __importDefault(require("../utilities/replaceOriginalFilename"));
const makeDataBackup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, makeZip_1.default)().then(r => {
        const stream = fs_1.default.createReadStream(path_1.default.resolve('src/backup/files.zip'));
        stream.pipe(res);
    });
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
            let mdFiles = yield (0, promises_1.readdir)((0, MDPath_1.MDDirpath)());
            let dbFiles = yield (0, promises_1.readdir)((0, MDPath_1.DBDirpath)());
            let mdFilesD = [];
            for (const file of mdFiles) {
                let a = yield (0, promises_1.stat)((0, MDPath_1.MDDirpath)() + "/" + file);
                mdFilesD.push({
                    dir: a.isDirectory(),
                    modifyTime: a.mtime,
                    name: file,
                    path: (0, MDPath_1.MDDirpath)() + "/" + file,
                    size: a.size
                });
            }
            let dbFilesD = [];
            for (const file of dbFiles) {
                let a = yield (0, promises_1.stat)((0, MDPath_1.DBDirpath)() + "/" + file);
                dbFilesD.push({
                    dir: a.isDirectory(),
                    modifyTime: a.mtime,
                    name: file,
                    path: (0, MDPath_1.DBDirpath)() + "/" + file,
                    size: a.size
                });
            }
            resolve({
                markdownFiles: mdFilesD ? mdFilesD : [],
                databaseFiles: dbFilesD ? dbFilesD : []
            });
        }
        catch (ex) {
            console.log(ex.message);
            resolve({
                markdownFiles: [],
                databaseFiles: []
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
                let uploadedPath = (0, MDPath_1.MDDirpath)() + "/" + name;
                yield (0, promises_1.cp)(newPath, uploadedPath, { force: true });
                (0, response_1.default)(res, 201, {
                    message: "Markdown File upload Success",
                    uploadedPath: uploadedPath
                });
            }
            else if (fields.dirType === "database") {
                let { newPath, name } = yield (0, replaceOriginalFilename_1.default)(files, "database");
                let uploadedPath = (0, MDPath_1.DBDirpath)() + "/" + name;
                yield (0, promises_1.cp)(newPath, uploadedPath, { force: true });
                (0, response_1.default)(res, 201, {
                    message: "Database File upload Success",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY29udHJvbGxlcnMvZmlsZXNDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJEQUFtQztBQUduQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsTUFBTSxRQUFRLEdBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBSXJDLG1FQUE2QztBQUM3Qyw0Q0FBb0I7QUFDcEIsNERBQW9DO0FBSXBDLGdEQUF3QjtBQUN4QixnREFBeUQ7QUFDekQsMENBQXVFO0FBQ3ZFLG1HQUEyRTtBQUlwRSxNQUFNLGNBQWMsR0FBSSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUMsRUFBRTtJQUMvQyxJQUFBLGlCQUFTLEdBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBLEVBQUU7UUFDbEIsTUFBTSxNQUFNLEdBQUcsWUFBRSxDQUFDLGdCQUFnQixDQUFFLGNBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFBO1FBQ3pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbEIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUEsQ0FBQTtBQUxZLFFBQUEsY0FBYyxrQkFLMUI7QUFHTSxNQUFNLGNBQWMsR0FBRyxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUMsRUFBRTtJQUM5QyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQTtJQUM3QixJQUFJO1FBQ0YsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsR0FBRyxNQUFNLElBQUEsZUFBSSxFQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzVCLElBQUcsQ0FBQyxFQUFFO2dCQUNKLDJDQUEyQztnQkFDM0MsSUFBSSxNQUFNLEdBQUcsWUFBRSxDQUFDLGdCQUFnQixDQUFDLGNB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