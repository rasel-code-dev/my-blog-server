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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwQWRtaW5Db250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY29udHJvbGxlcnMvYXBwQWRtaW5Db250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNsQyxNQUFNLFFBQVEsR0FBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFNckMsNERBQW9DO0FBS3BDLGdEQUF5RDtBQUN6RCwwQ0FBdUU7QUFDdkUsbUdBQTJFO0FBQzNFLHVEQUFnRDtBQUl6QyxNQUFNLFdBQVcsR0FBSSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUMsRUFBRTtJQUM1QyxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFBO0FBQzFDLENBQUMsQ0FBQSxDQUFBO0FBRlksUUFBQSxXQUFXLGVBRXZCO0FBRU0sTUFBTSxVQUFVLEdBQUksQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDM0MsSUFBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQztRQUNqQixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDO1lBQ3RELElBQUksS0FBSyxHQUFJLE1BQU0sSUFBQSwrQkFBYSxHQUFFLENBQUE7WUFDbEMsSUFBRyxLQUFLLEVBQUU7Z0JBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtvQkFDakMsT0FBTyxFQUFFLDBCQUEwQjtvQkFDbkMsUUFBUSxFQUFFLEtBQUssQ0FBQyxhQUFhO29CQUM3QixRQUFRLEVBQUUsS0FBSyxDQUFDLGFBQWE7aUJBQzlCLENBQUMsQ0FBQTthQUNIO1NBQ0Y7YUFBTTtZQUNMLEdBQUcsQ0FBQyxNQUFNLENBQUMs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