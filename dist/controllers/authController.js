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
const getAppCookies_1 = __importDefault(require("../utilities/getAppCookies"));
const fs_1 = __importDefault(require("fs"));
const formidable_1 = __importDefault(require("formidable"));
const cloudinary_1 = require("../cloudinary");
const replaceOriginalFilename_1 = __importDefault(require("../utilities/replaceOriginalFilename"));
const hash_1 = require("../hash");
const redisUtils_1 = require("../utilities/redisUtils");
const database_1 = require("../database");
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let date = new Date();
        let { first_name, last_name, email, password } = req.body;
        let users = yield (0, redisUtils_1.getHashData)("users", client);
        let user = users.find(u => u.email === email);
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
        let n = yield client.HSET("users", newUser.id, JSON.stringify(newUser));
        if (n) {
            let token = yield (0, jwt_1.createToken)(newUser.id, newUser.email);
            (0, response_1.default)(res, 201, Object.assign({ token: token }, newUser));
        }
        else {
            (0, response_1.default)(res, 500, "Please Try Again");
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, "Please Try Again");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.createNewUser = createNewUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        const { email, password } = req.body;
        let users = yield (0, redisUtils_1.getHashData)("users", client);
        let user = users.find(u => u.email === email);
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
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.loginUser = loginUser;
const loginViaToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let token = req.headers["token"];
        if (!token)
            return (0, response_1.default)(res, 404, "token not found");
        let { id, email } = yield (0, jwt_1.parseToken)(token);
        let users = yield (0, redisUtils_1.getHashData)("users", client);
        let user = users.find(u => u.email === email);
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
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.loginViaToken = loginViaToken;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let userStr = yield client.HGET("users", id);
        let user = JSON.parse(userStr);
        let { password, role } = user, o = __rest(user, ["password", "role"]);
        (0, response_1.default)(res, 200, { user: o });
    }
    catch (ex) {
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.getUser = getUser;
function setDayVisitor(client, ID) {
    return __awaiter(this, void 0, void 0, function* () {
        let now = new Date();
        return new Promise((s, r) => __awaiter(this, void 0, void 0, function* () {
            try {
                let day_visitor = yield client.GET("day_visitor");
                if (day_visitor) {
                    let mv = Object.assign({}, JSON.parse(day_visitor));
                    // first check change date or not...
                    let isChangeDay = now.getDate() > Number(mv.day);
                    if (!isChangeDay) {
                        ///
                        if (mv.ids.indexOf(ID) === -1) {
                            mv.ids.push(ID);
                        }
                    }
                    else {
                        /// reset new date
                        mv = {
                            day: now.getDate(),
                            ids: [ID],
                        };
                    }
                    let insert = yield client.SET("day_visitor", JSON.stringify(mv));
                    if (insert) {
                        s(mv.ids.length);
                    }
                }
                else {
                    yield client.SET("day_visitor", JSON.stringify({
                        day: now.getDate(),
                        ids: [ID],
                    }));
                    s(1);
                }
            }
            catch (ex) {
                r(0);
            }
        }));
    });
}
const cookieAdd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let randomID = Math.ceil(Date.now() / 1000);
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let app_visitor_count = yield client.sCard("app_visitor");
        let day_visitor_count = 0;
        if ((0, getAppCookies_1.default)(req).browser_uuid) {
            // response(res, 200, {message: "cookie already exists"})
            day_visitor_count = yield setDayVisitor(client, (0, getAppCookies_1.default)(req).browser_uuid);
            (0, response_1.default)(res, 201, {
                message: "cookie send",
                day_visitor: day_visitor_count,
                total_visitor: app_visitor_count,
            });
        }
        else {
            // increase total visitor....
            let isSet = yield client.sAdd("app_visitor", randomID.toString());
            if (isSet) {
                res.cookie('browser_uuid', randomID, {
                    maxAge: ((1000 * 3600) * 24) * 30,
                    httpOnly: true,
                    // domain: 'rsl-blog-server-1.herokuapp.com',
                    // domain: 'http://localhost:5500',
                    sameSite: 'none',
                    // Forces to use https in production
                    secure: true
                });
                day_visitor_count = yield setDayVisitor(client, randomID.toString());
                (0, response_1.default)(res, 201, {
                    message: "cookie send",
                    day_visitor: day_visitor_count,
                    total_visitor: app_visitor_count + 1,
                });
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.cookieAdd = cookieAdd;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let userStr = yield client.HGET("users", req.user_id);
        let user = JSON.parse(userStr);
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
            let updatedUser = client.HSET("users", req.user_id, JSON.stringify(Object.assign(Object.assign({}, user), setUser)));
            console.log(yield updatedUser);
            if (updatedUser) {
                return (0, response_1.default)(res, 201, {
                    user: Object.assign(Object.assign({}, updatedUser), { password: newPassword }),
                    message: "Operation completed"
                });
            }
        }
    }
    catch (ex) {
    }
    finally {
        yield (client === null || client === void 0 ? void 0 : client.quit());
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
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let client;
                    try {
                        client = yield (0, database_1.redisConnect)();
                        if (image.secure_url) {
                            let userStr = yield client.HGET("users", req.user_id);
                            let user = JSON.parse(userStr);
                            yield client.HSET("users", user.id, JSON.stringify(Object.assign(Object.assign({}, user), { avatar: image.secure_url })));
                            if (user) {
                                fs_1.default.rm(newPath, () => { });
                                res.json({ message: "profile photo has been changed", avatar: image.secure_url });
                            }
                        }
                        else {
                            fs_1.default.rm(newPath, () => { });
                            res.json({ message: "avatar photo upload fail", avatar: "" });
                        }
                    }
                    catch (ex) {
                        res.json({ message: "avatar photo upload fail", avatar: "" });
                    }
                    finally {
                        yield (client === null || client === void 0 ? void 0 : client.quit());
                    }
                });
            }());
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
                        (function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                let client;
                                try {
                                    client = yield (0, database_1.redisConnect)();
                                    if (image.secure_url) {
                                        let userStr = yield client.HGET("users", req.user_id);
                                        let user = JSON.parse(userStr);
                                        yield client.HSET("users", user.user_id, JSON.stringify(Object.assign(Object.assign({}, user), { cover: image.secure_url })));
                                        if (user) {
                                            fs_1.default.rm(newPath, () => { });
                                            res.json({ message: "cover photo has been changed", cover: image.secure_url });
                                        }
                                    }
                                    else {
                                        fs_1.default.rm(newPath, () => { });
                                        res.json({ message: "cover photo upload fail", avatar: "" });
                                    }
                                }
                                catch (err) {
                                    res.json({ message: "cover photo upload fail", avatar: "" });
                                }
                                finally {
                                    yield (client === null || client === void 0 ? void 0 : client.quit());
                                }
                            });
                        }());
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
const getAuthPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.user_id !== req.query.user_id) {
        return (0, response_1.default)(res, 409, { message: "You are unauthorized" });
    }
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let userStr = client.HGET("users", req.body.user_id);
        let user = JSON.parse(userStr);
        // response(res, 201, other)
        (0, response_1.default)(res, 200, user.password);
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        return (0, response_1.default)(res, 500, ex.message);
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.getAuthPassword = getAuthPassword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVycy9hdXRoQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJEQUFtQztBQUNuQyxnQ0FBK0M7QUFDL0MsMEVBQWtEO0FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUdsQywrRUFBdUQ7QUFDdkQsNENBQW9CO0FBQ3BCLDREQUFvQztBQUNwQyw4Q0FBMEM7QUFFMUMsbUdBQTJFO0FBQzNFLGtDQUFnRDtBQUNoRCx3REFBb0Q7QUFDcEQsMENBQXlDO0FBR2xDLE1BQU0sYUFBYSxHQUFHLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRTtJQUNuRCxJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUk7UUFDRixNQUFNLEdBQUcsTUFBTSxJQUFBLHVCQUFZLEdBQUUsQ0FBQTtRQUM3QixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO1FBQ3JCLElBQUksRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO1FBQ3hELElBQUksS0FBSyxHQUFHLE1BQU0sSUFBQSx3QkFBVyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUM5QyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxFQUFFLENBQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQTtRQUMzQyxJQUFHLElBQUk7WUFBRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUF5QixFQUFDLENBQUMsQ0FBQTtRQUUxRSxNQUFNLEVBQUMsR0FBRyxFQUFFLElBQUks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