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