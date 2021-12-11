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
                    markdown: []
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwQWRtaW5Db250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2NvbnRyb2xsZXJzL2FwcEFkbWluQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsTUFBTSxRQUFRLEdBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBTXJDLDREQUFvQztBQUtwQyxnREFBeUQ7QUFDekQsMENBQXVFO0FBQ3ZFLG1HQUEyRTtBQUMzRSx1REFBZ0Q7QUFJekMsTUFBTSxXQUFXLEdBQUksQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDNUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTtBQUMxQyxDQUFDLENBQUEsQ0FBQTtBQUZZLFFBQUEsV0FBVyxlQUV2QjtBQUVNLE1BQU0sVUFBVSxHQUFJLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFO0lBQzNDLElBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUM7UUFDakIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBQztZQUN0RCxJQUFJLEtBQUssR0FBSSxNQUFNLElBQUEsK0JBQWEsR0FBRSxDQUFBO1lBQ2xDLElBQUcsS0FBSyxFQUFFO2dCQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUU7b0JBQ2pDLE9BQU8sRUFBRSwwQkFBMEI7b0JBQ25DLFFBQVEsRUFBRSxLQUFLLENBQUMsYUFBYTtvQkFDN0IsUUFBUSxFQUFFLEVBQUU7aUJBQ2IsQ0FBQyxDQUFBO2FBQ0g7U0FDRjthQUFNO1lBQ0wsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVB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