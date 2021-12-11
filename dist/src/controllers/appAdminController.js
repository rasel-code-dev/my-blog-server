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
exports.uploadDatabaseFile = exports.adminLogin = exports.getHomePage = void 0;
const shortid = require("shortid");
const bcryptjs = require("bcryptjs");
const formidable_1 = __importDefault(require("formidable"));
const MDPath_1 = require("../utilities/MDPath");
const promises_1 = require("fs/promises");
const replaceOriginalFilename_1 = __importDefault(require("../utilities/replaceOriginalFilename"));
const filesController_1 = require("./filesController");
const getHomePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("pages/index", { message: "" });
});
exports.getHomePage = getHomePage;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.secret) {
        if (req.body.secret.trim() === process.env.ADMIN_SECRET) {
            let files = yield (0, filesController_1.getDBFileList)();
            if (files) {
                res.render("pages/admin-homepage", {
                    message: "Welcome Mr. Rasel Mahmud",
                    database: files.databaseFiles,
                    markdown: files.markdownFiles
                });
            }
        }
        else {
            res.render("pages/index", { message: "You are not Admin" });
        }
    }
    else {
        res.render("pages/index", { message: "You are not Admin" });
    }
});
exports.adminLogin = adminLogin;
const uploadDatabaseFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const form = (0, formidable_1.default)({ multiples: true });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // return response(res, 500, {
            //   message: "File upload fail. " + err.message
            // })
        }
        try {
            if (fields.dirType === "markdown") {
                let { newPath, name } = yield (0, replaceOriginalFilename_1.default)(files, "markdown");
                let uploadedPath = (0, MDPath_1.MDDirpath)() + "/" + name;
                yield (0, promises_1.cp)(newPath, uploadedPath, { force: true });
                let dataFiles = yield (0, filesController_1.getDBFileList)();
                if (dataFiles) {
                    res.render("pages/admin-homepage", {
                        message: "Welcome Mr. Rasel Mahmud",
                        database: dataFiles.databaseFiles,
                        markdown: dataFiles.markdownFiles
                    });
                }
                // response(res, 201, {
                //   message: "Markdown File upload Success",
                //   uploadedPath: uploadedPath
                // })
            }
            else if (fields.dirType === "database") {
                let { newPath, name } = yield (0, replaceOriginalFilename_1.default)(files, "database");
                let uploadedPath = (0, MDPath_1.DBDirpath)() + "/" + name;
                yield (0, promises_1.cp)(newPath, uploadedPath, { force: true });
                let dataFiles = yield (0, filesController_1.getDBFileList)();
                if (dataFiles) {
                    res.render("pages/admin-homepage", {
                        message: "Welcome Mr. Rasel Mahmud",
                        database: dataFiles.databaseFiles,
                        markdown: dataFiles.markdownFiles
                    });
                }
            }
        }
        catch (ex) {
            // response(res, 500, {
            //   message: "File upload fail" + ex.message
            // })
        }
    }));
    // res.render("pages/admin-homepage", {message: "You are not Admin", database: [], markdown: []})
});
exports.uploadDatabaseFile = uploadDatabaseFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwQWRtaW5Db250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2NvbnRyb2xsZXJzL2FwcEFkbWluQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsTUFBTSxRQUFRLEdBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBTXJDLDREQUFvQztBQUtwQyxnREFBeUQ7QUFDekQsMENBQXVFO0FBQ3ZFLG1HQUEyRTtBQUMzRSx1REFBZ0Q7QUFJekMsTUFBTSxXQUFXLEdBQUksQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDNUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTtBQUMxQyxDQUFDLENBQUEsQ0FBQTtBQUZZLFFBQUEsV0FBVyxlQUV2QjtBQUVNLE1BQU0sVUFBVSxHQUFJLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFO0lBQzNDLElBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUM7UUFDakIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBQztZQUN0RCxJQUFJLEtBQUssR0FBSSxNQUFNLElBQUEsK0JBQWEsR0FBRSxDQUFBO1lBQ2xDLElBQUcsS0FBSyxFQUFFO2dCQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUU7b0JBQ2pDLE9BQU8sRUFBRSwwQkFBMEI7b0JBQ25DLFFBQVEsRUFBRSxLQUFLLENBQUMsYUFBYTtvQkFDN0IsUUFBUSxFQUFFLEtBQUssQ0FBQyxhQUFhO2lCQUM5QixDQUFDLENBQUE7YUFDSDtTQUNGO2FBQU07WUFDTCxHQUFHLENBQUMsTUFBTSxD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