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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMarkdownImage = exports.uploadProfileCoverPhoto = exports.uploadProfilePhoto = exports.makeDataBackup = exports.cookieAdd = exports.getUser = exports.loginViaToken = exports.loginUser = exports.createNewUser = void 0;
const response_1 = __importDefault(require("../response"));
const jwt_1 = require("../jwt");
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const shortid = require("shortid");
const bcryptjs = require("bcryptjs");
const visitorDB_1 = __importDefault(require("../database/visitorDB"));
const getAppCookies_1 = __importDefault(require("../utilities/getAppCookies"));
const makeZip_1 = __importDefault(require("../utilities/makeZip"));
const fs_1 = __importDefault(require("fs"));
const formidable_1 = __importDefault(require("formidable"));
const cloudinary_1 = require("../cloudinary");
const db_1 = __importDefault(require("../database/db"));
const path_1 = __importDefault(require("path"));
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let date = new Date();
        let { first_name, last_name, email, password } = req.body;
        let user = db_1.default.get('users').find({ email: email }).value();
        if (user)
            return res.status(409).json({ message: "User already registered" });
        let salt = yield bcryptjs.genSalt(10);
        let hashedPass = yield bcryptjs.hash(password, salt);
        let newUser = {
            id: shortid.generate(),
            first_name,
            last_name,
            email,
            password: hashedPass,
            avatar: "",
            username: first_name + " " + last_name,
            created_at: date,
            updated_at: date
        };
        db_1.default.get('users').push(newUser).write();
        let token = yield (0, jwt_1.createToken)(newUser.id, newUser.email);
        res.status(201).json(Object.assign({ token: token }, newUser));
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createNewUser = createNewUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let user = db_1.default.get('users').find({ email: email }).value();
        if (user) {
            let match = yield bcryptjs.compare(password, user.password);
            if (!match)
                return res.status(404).json({ message: "Password not match" });
            let token = yield (0, jwt_1.createToken)(user.id, user.email);
            let { password: s } = user, other = __rest(user, ["password"]);
            res.json(Object.assign({ token: token }, other));
        }
        else {
            res.status(404).json({ message: "This email not yet register." });
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
    }
});
exports.loginUser = loginUser;
const loginViaToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["token"];
        if (!token)
            return (0, response_1.default)(res, 404, "token not found");
        let { id, email } = yield (0, jwt_1.parseToken)(token);
        let user = db_1.default.get('users').find({ email: email }).value();
        let { password } = user, other = __rest(user, ["password"]);
        (0, response_1.default)(res, 201, other);
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        return (0, response_1.default)(res, 500, ex.message);
    }
});
exports.loginViaToken = loginViaToken;
const getUser = (req, res) => {
    const { username } = req.query;
    let user = db_1.default.get('users').find({ username: username }).value();
    let { password, role } = user, o = __rest(user, ["password", "role"]);
    (0, response_1.default)(res, 200, { user: o });
};
exports.getUser = getUser;
const cookieAdd = (req, res) => {
    let randomID = Math.ceil(Date.now() / 1000);
    let total_visitor = visitorDB_1.default.get("app_visitor").find({ total_visitor: '' }).value();
    if ((0, getAppCookies_1.default)(req).browser_uuid) {
        // response(res, 200, {message: "cookie already exists"})
    }
    else {
        res.cookie('browser_uuid', randomID, {
            maxAge: ((1000 * 3600) * 24) * 30,
            // You can't access these tokens in the client's javascript
            httpOnly: false,
            // Forces to use https in production
            secure: process.env.NODE_ENV !== 'development'
        });
        // increase total visitor....
        if (total_visitor) {
            total_visitor.ids.push(randomID);
        }
        else {
            total_visitor = { total_visitor: "", ids: [randomID] };
        }
        visitorDB_1.default.get("app_visitor").assign({ total_visitor: total_visitor }).write();
    }
    let day_visitor = visitorDB_1.default.get("app_visitor").find({ day_visitor: '' }).value();
    if (day_visitor) {
        day_visitor.ids.push(randomID);
    }
    else {
        day_visitor = { day_visitor: "", ids: [randomID] };
    }
    visitorDB_1.default.get("app_visitor").assign({ day_visitor: day_visitor }).write();
    (0, response_1.default)(res, 201, {
        message: "cookie send",
        day_visitor: day_visitor,
        total_visitor: total_visitor,
    });
};
exports.cookieAdd = cookieAdd;
const makeDataBackup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, makeZip_1.default)().then(r => {
        const stream = fs_1.default.createReadStream(path_1.default.resolve('src/backup/files.zip'));
        stream.pipe(res);
    });
});
exports.makeDataBackup = makeDataBackup;
const uploadProfilePhoto = (req, res, next) => {
    const form = (0, formidable_1.default)({ multiples: true });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return;
        }
        if (files && files.avatar) {
            let tempDir = files.avatar.filepath.replace(files.avatar.newFilename, '');
            let newPath = tempDir + files.avatar.originalFilename;
            fs_1.default.rename(files.avatar.filepath, newPath, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (!err) {
                    (0, cloudinary_1.uploadImage)(newPath).then(image => {
                        if (image.secure_url) {
                            let r = db_1.default.get("users").find({ id: req.user_id }).assign({ avatar: image.secure_url }).write();
                            if (r) {
                                fs_1.default.rm(newPath, () => {
                                });
                                res.json({ message: "profile photo has been changed", avatar: image.secure_url });
                            }
                        }
                        else {
                            fs_1.default.rm(newPath, () => {
                            });
                            res.json({ message: "avatar photo upload fail", avatar: "" });
                        }
                    });
                }
            }));
        }
    }));
};
exports.uploadProfilePhoto = uploadProfilePhoto;
const uploadProfileCoverPhoto = (req, res, next) => {
    const form = (0, formidable_1.default)({ multiples: true });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return;
        }
        if (files && files.cover) {
            let tempDir = files.cover.filepath.replace(files.cover.newFilename, '');
            let newPath = tempDir + files.cover.originalFilename;
            fs_1.default.rename(files.cover.filepath, newPath, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (!err) {
                    (0, cloudinary_1.uploadImage)(newPath).then(image => {
                        if (image.secure_url) {
                            let r = db_1.default.get("users").find({ id: req.user_id }).assign({ cover: image.secure_url }).write();
                            if (r) {
                                fs_1.default.rm(newPath, () => {
                                });
                                res.json({ message: "cover photo has been changed", cover: image.secure_url });
                            }
                        }
                        else {
                            fs_1.default.rm(newPath, () => {
                            });
                            res.json({ message: "cover photo upload fail", avatar: "" });
                        }
                    });
                }
            }));
        }
    }));
};
exports.uploadProfileCoverPhoto = uploadProfileCoverPhoto;
const uploadMarkdownImage = (req, res, next) => {
    const form = (0, formidable_1.default)({ multiples: false });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return;
        }
        if (files && files.photo) {
            let tempDir = files.photo.filepath.replace(files.photo.newFilename, '');
            let newPath = tempDir + files.photo.originalFilename;
            fs_1.default.rename(files.photo.filepath, newPath, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (!err) {
                    (0, cloudinary_1.uploadImage)(newPath).then(image => {
                        if (image.secure_url) {
                            fs_1.default.rm(newPath, () => { });
                            res.json({ message: "markdown image upload complete", path: image.secure_url });
                        }
                        else {
                            fs_1.default.rm(newPath, () => { });
                            res.json({ message: "markdown image upload fail", path: "" });
                        }
                    })
                        .catch(ex => {
                        res.status(500).json({ message: "markdown image upload fail", path: "" });
                    });
                }
            }));
        }
    }));
};
exports.uploadMarkdownImage = uploadMarkdownImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvYXV0aENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsZ0NBQStDO0FBQy9DLDBFQUFrRDtBQUNsRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsTUFBTSxRQUFRLEdBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRXJDLHNFQUE4QztBQUM5QywrRUFBdUQ7QUFDdkQsbUVBQTZDO0FBQzdDLDRDQUFvQjtBQUNwQiw0REFBb0M7QUFDcEMsOENBQTBDO0FBRTFDLHdEQUFnQztBQUNoQyxnREFBd0I7QUFHakIsTUFBTSxhQUFhLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFO0lBQ25ELElBQUk7UUFDRixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO1FBQ3JCLElBQUksRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO1FBQ3hELElBQUksSUFBSSxHQUFHLFlBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDekQsSUFBRyxJQUFJO1lBQUUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBQyxDQUFDLENBQUE7UUFFMUUsSUFBSSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksVUFBVSxHQUFHLE1BQU0sUUFB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