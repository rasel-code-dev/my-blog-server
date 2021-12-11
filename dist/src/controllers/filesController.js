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
        // let mdFiles = await readdir(MDDirpath())
        let dbFiles = yield (0, promises_1.readdir)((0, MDPath_1.DBDirpath)());
        let mdFilesD = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2NvbnRyb2xsZXJzL2ZpbGVzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFHbkMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLE1BQU0sUUFBUSxHQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUlyQyxtRUFBNkM7QUFDN0MsNENBQW9CO0FBQ3BCLDREQUFvQztBQUlwQyxnREFBd0I7QUFDeEIsZ0RBQXlEO0FBQ3pELDBDQUF1RTtBQUN2RSxtR0FBMkU7QUFJcEUsTUFBTSxjQUFjLEdBQUksQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDL0MsSUFBQSxpQkFBUyxHQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxFQUFFO1FBQ2xCLE1BQU0sTUFBTSxHQUFHLFlBQUUsQ0FBQyxnQkFBZ0IsQ0FBRSxjQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQTtRQUN6RSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2xCLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBLENBQUE7QUFMWSxRQUFBLGNBQWMsa0JBSzFCO0FBR00sTUFBTSxjQUFjLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDOUMsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUE7SUFDN0IsSUFBSTtRQUNGLElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFBLGVBQUksRUFBQyxRQUFRLENBQUMsQ0FBQTtZQUM1QixJQUFHLENBQUMsRUFBRTtnQkFDSiwyQ0FBMkM7Z0JBQzNDLElBQUksTUFBTSxHQUFHLFlBQUUsQ0FBQyxnQkFBZ0IsQ0FB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