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
        if (user) {
            let { password } = user, other = __rest(user, ["password"]);
            (0, response_1.default)(res, 201, other);
        }
        else {
            (0, response_1.default)(res, 404, { message: "User not found" });
        }
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
            httpOnly: true,
            domain: 'rsl-blog-server-1.herokuapp.com',
            sameSite: 'none',
            // Forces to use https in production
            secure: true
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