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
exports.getAuthPassword = exports.uploadMarkdownImage = exports.uploadProfileCoverPhoto = exports.uploadProfilePhoto = exports.updateProfile = exports.cookieAdd = exports.getUser = exports.loginViaToken = exports.loginUser = exports.createNewUser = void 0;
const response_1 = __importDefault(require("../response"));
const jwt_1 = require("../jwt");
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const shortid = require("shortid");
const visitorDB_1 = __importDefault(require("../database/visitorDB"));
const getAppCookies_1 = __importDefault(require("../utilities/getAppCookies"));
const fs_1 = __importDefault(require("fs"));
const formidable_1 = __importDefault(require("formidable"));
const cloudinary_1 = require("../cloudinary");
const db_1 = __importDefault(require("../database/db"));
const replaceOriginalFilename_1 = __importDefault(require("../utilities/replaceOriginalFilename"));
const hash_1 = require("../hash");
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let date = new Date();
        let { first_name, last_name, email, password } = req.body;
        let user = db_1.default.get('users').find({ email: email }).value();
        if (user)
            return res.status(409).json({ message: "User already registered" });
        const { err, hash } = yield (0, hash_1.createHash)(password);
        let newUser = {
            id: shortid.generate(),
            first_name,
            last_name,
            email,
            password: hash,
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
            let match = yield (0, hash_1.hashCompare)(password, user.password);
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
    console.log((0, getAppCookies_1.default)(req));
    if ((0, getAppCookies_1.default)(req).browser_uuid) {
        // response(res, 200, {message: "cookie already exists"})
    }
    else {
        res.cookie('browser_uuid', randomID, {
            maxAge: ((1000 * 3600) * 24) * 30,
            httpOnly: true,
            domain: 'https://rasel-code-dev.github.io',
            sameSite: 'none',
            // Forces to use https in production
            secure: process.env.NODE_ENV !== 'development'
        });
        console.log(process.env.NODE_ENV, "---------------------");
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
        day_visitor.ids = Number(day_visitor.ids) + 1;
    }
    else {
        day_visitor = { day_visitor: "", ids: 1 };
    }
    visitorDB_1.default.get("app_visitor").assign({ day_visitor: day_visitor }).write();
    (0, response_1.default)(res, 201, {
        message: "cookie send",
        day_visitor: day_visitor,
        total_visitor: total_visitor,
    });
};
exports.cookieAdd = cookieAdd;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = db_1.default.get("users").find({ id: req.user_id }).value();
    if (user) {
        const { username, first_name, last_name, email, oldPassword, newPassword } = req.body;
        let setUser = {};
        if (oldPassword && newPassword) {
            let match = yield (0, hash_1.hashCompare)(oldPassword, user.password);
            if (!match) {
                return (0, response_1.default)(res, 409, { message: "current password doesn't match" });
            }
            let { err, hash } = yield (0, hash_1.createHash)(newPassword);
            setUser.password = hash;
            if (err) {
                return (0, response_1.default)(res, 500, { message: err });
            }
        }
        if (username) {
            setUser.username = username;
        }
        if (first_name) {
            setUser.first_name = first_name;
        }
        if (last_name) {
            setUser.last_name = last_name;
        }
        if (email) {
            setUser.email = email;
        }
        let updatedUser = db_1.default.get("users").find({ id: req.user_id }).assign(Object.assign({}, setUser)).value();
        if (updatedUser) {
            return (0, response_1.default)(res, 201, {
                user: Object.assign(Object.assign({}, updatedUser), { password: newPassword }),
                message: "Operation completed"
            });
        }
    }
});
exports.updateProfile = updateProfile;
const uploadProfilePhoto = (req, res, next) => {
    const form = (0, formidable_1.default)({ multiples: true });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return;
        }
        let { newPath, name } = yield (0, replaceOriginalFilename_1.default)(files, "avatar");
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
const getAuthPassword = (req, res) => {
    if (req.body.user_id !== req.query.user_id) {
        return (0, response_1.default)(res, 409, { message: "You are unauthorized" });
    }
    try {
        let user = db_1.default.get('users').find({ id: req.body.user_id }).value();
        // response(res, 201, other)
        (0, response_1.default)(res, 200, "DF");
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        return (0, response_1.default)(res, 500, ex.message);
    }
};
exports.getAuthPassword = getAuthPassword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvYXV0aENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsZ0NBQStDO0FBQy9DLDBFQUFrRDtBQUNsRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFHbEMsc0VBQThDO0FBQzlDLCtFQUF1RDtBQUN2RCw0Q0FBb0I7QUFDcEIsNERBQW9DO0FBQ3BDLDhDQUEwQztBQUUxQyx3REFBZ0M7QUFDaEMsbUdBQTJFO0FBQzNFLGtDQUFnRDtBQUd6QyxNQUFNLGFBQWEsR0FBRyxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUU7SUFDbkQsSUFBSTtRQUNGLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7UUFDckIsSUFBSSxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7UUFDeEQsSUFBSSxJQUFJLEdBQUcsWUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUN6RCxJQUFHLElBQUk7WUFBRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUF5QixFQUFDLENBQUMsQ0FBQTtRQUMxRSxNQUFNLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxHQUFHLE1BQU0sSUFBQSxpQkFBVSxFQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzlDLElBQUksT0FBTyxHQUFHO1lBQ1osRUFBRSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFD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