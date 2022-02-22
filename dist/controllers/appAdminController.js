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
const formidable_1 = __importDefault(require("formidable"));
const promises_1 = require("fs/promises");
const replaceOriginalFilename_1 = __importDefault(require("../utilities/replaceOriginalFilename"));
const filesController_1 = require("./filesController");
const path_1 = __importDefault(require("path"));
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
                    markdown: files
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
            let files = yield (0, filesController_1.getDBFileList)();
            if (files) {
                res.render("pages/admin-homepage", {
                    message: "Welcome Mr. Rasel Mahmud",
                    markdown: files
                });
            }
        }
        try {
            if (fields.dirType === "markdown") {
                let { newPath, name } = yield (0, replaceOriginalFilename_1.default)(files, "markdown");
                let dir = path_1.default.resolve("src/markdown");
                let uploadedPath = path_1.default.join(dir + "/" + name);
                yield (0, promises_1.cp)(newPath, uploadedPath, { force: true });
                let dataFiles = yield (0, filesController_1.getDBFileList)();
                if (dataFiles) {
                    res.render("pages/admin-homepage", {
                        message: "Welcome Mr. Rasel Mahmud",
                        markdown: dataFiles
                    });
                }
                // response(res, 201, {
                //   message: "Markdown File upload Success",
                //   uploadedPath: uploadedPath
                // })
            }
        }
        catch (ex) {
            console.log(ex);
            let files = yield (0, filesController_1.getDBFileList)();
            if (files) {
                res.render("pages/admin-homepage", {
                    message: "Welcome Mr. Rasel Mahmud",
                    markdown: files
                });
            }
            // response(res, 500, {
            //   message: "File upload fail" + ex.message
            // })
        }
    }));
    // res.render("pages/admin-homepage", {message: "You are not Admin", database: [], markdown: []})
});
exports.uploadDatabaseFile = uploadDatabaseFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwQWRtaW5Db250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY29udHJvbGxlcnMvYXBwQWRtaW5Db250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDREQUFvQztBQUVwQywwQ0FBZ0M7QUFDaEMsbUdBQTJFO0FBQzNFLHVEQUFnRDtBQUNoRCxnREFBd0I7QUFLakIsTUFBTSxXQUFXLEdBQUksQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDNUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTtBQUMxQyxDQUFDLENBQUEsQ0FBQTtBQUZZLFFBQUEsV0FBVyxlQUV2QjtBQUVNLE1BQU0sVUFBVSxHQUFJLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFO0lBQzNDLElBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUM7UUFDakIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBQztZQUN0RCxJQUFJLEtBQUssR0FBSSxNQUFNLElBQUEsK0JBQWEsR0FBRSxDQUFBO1lBQ2xDLElBQUcsS0FBSyxFQUFFO2dCQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUU7b0JBQ2pDLE9BQU8sRUFBRSwwQkFBMEI7b0JBQ25DLFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUE7YUFDSDtTQUNGO2FBQU07WUFDTCxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBQyxDQUFDLENBQUE7U0FDMUQ7S0FHRjtTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxDQUFBO0tBQzFEO0FBQ0gsQ0FBQyxDQUFBLENBQUE7QUFsQlksUUFBQSxVQUFVLGNBa0J0QjtBQUVNLE1BQU0sa0JBQWtCLEdBQUksQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDbkQsTUFBTSxJQUFJLEdBQUcsSUFBQSxvQkFBVSxFQUFDLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7SUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxFQUFFO1FBRzFDLElBQUksR0FBRyxFQUFFO1lBQ1AsSUFBSSxLQUFLLEdBQVUsTUFBTSxJQUFBLCtCQUFhLEdBQUUsQ0FBQTtZQUN4QyxJQUFHLEtBQUssRUFBRTtnQkFDUixHQUFHLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFO29CQUNqQyxPQUFPLEVBQUUsMEJBQTBCO29CQUNuQyxRQUFRLEVBQUUsS0FBSztpQkFDaEIsQ0FBQyxDQUFBO2FBQ0g7U0FDRjtRQUVELElBQUk7WUFDRixJQUFHLE1BQU0sQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFDO2dCQUUvQixJQUFJLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxHQUFHLE1BQU0sSUFBQSxpQ0FBdUIsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUE7Z0JBRXRFLElBQUksR0FBRyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7Z0JBQ3RDLElBQUksWUFBWSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQTtnQkFDOUMsTUFBTSxJQUFBLGFBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7Z0JBQzdDLElBQUksU0FBUyxHQUFJLE1BQU0sSUFBQSwrQkFBYSxHQUFFLENBQUE7Z0JBQ3RDLElBQUcsU0FBUyxFQUFFO29CQUNaLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUU7d0JBQ2pDLE9BQU8sRUFBRSwwQkFBMEI7d0JBQ25DLFFBQVEsRUFBRSxTQUFTO3FCQUNwQixDQUFDLENBQUE7aUJBQ0g7Z0JBQ0QsdUJBQXVCO2dCQUN2Qiw2Q0FBNkM7Z0JBQzdDLCtCQUErQjtnQkFDL0IsS0FBSzthQUVOO1NBRUY7UUFBQyxPQUFPLEVBQUUsRUFBQztZQUVWLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFZixJQUFJLEtBQUssR0FBSSxNQUFNLElBQUEsK0JBQWEsR0FBRSxDQUFBO1lBQ2xDLElBQUcsS0FBSyxFQUFFO2dCQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUU7b0JBQ2pDLE9BQU8sRUFBRSwwQkFBMEI7b0JBQ25DLFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUE7YUFDSDtZQUNELHVCQUF1QjtZQUN2Qiw2Q0FBNkM7WUFDN0MsS0FBSztTQUNOO0lBR0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNGLGlHQUFpRztBQUNuRyxDQUFDLENBQUEsQ0FBQTtBQXhEWSxRQUFBLGtCQUFrQixzQkF3RDlCIn0=