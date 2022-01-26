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
exports.changePassword = exports.checkPasswordResetSessionTimeout = exports.sendPasswordResetMail = exports.getAuthPassword = exports.uploadMarkdownImage = exports.uploadProfileCoverPhoto = exports.uploadProfilePhoto = exports.updateProfile = exports.cookieAdd = exports.getUser = exports.loginViaToken = exports.loginUser = exports.createNewUser = void 0;
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
const sendMail_1 = __importDefault(require("../utilities/sendMail"));
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
        let { email, password } = req.body;
        if (!(email && password)) {
            return (0, response_1.default)(res, 409, "Missing credential");
        }
        let { token, user } = yield loginUserHandler(email, password);
        (0, response_1.default)(res, 201, Object.assign({ token: token }, user));
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, ex.message ? ex.message : "Internal Error");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.loginUser = loginUser;
function loginUserHandler(email, password) {
    return new Promise((s, e) => __awaiter(this, void 0, void 0, function* () {
        let client;
        try {
            client = yield (0, database_1.redisConnect)();
            let users = yield (0, redisUtils_1.getHashData)("users", client);
            let user = users.find(u => u.email === email);
            if (user) {
                let match = yield (0, hash_1.hashCompare)(password, user.password);
                if (!match)
                    return e(new Error("Password not match"));
                let token = yield (0, jwt_1.createToken)(user.id, user.email);
                let { password: sss } = user, other = __rest(user, ["password"]);
                s({ user: other, token });
            }
            else {
                e(new Error("login fail"));
            }
        }
        catch (ex) {
            (0, errorConsole_1.default)(ex);
            e(ex);
        }
        finally {
            client === null || client === void 0 ? void 0 : client.quit();
        }
    }));
}
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
            (0, response_1.default)(res, 201, Object.assign({}, other));
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
        let client;
        try {
            client = yield (0, database_1.redisConnect)();
            let cloudImage = yield (0, cloudinary_1.uploadImage)(newPath);
            if (cloudImage.secure_url) {
                let userStr = yield client.HGET("users", req.user_id);
                let user = JSON.parse(userStr);
                yield client.HSET("users", user.id, JSON.stringify(Object.assign(Object.assign({}, user), { avatar: cloudImage.secure_url })));
                if (user) {
                    fs_1.default.rm(newPath, () => { });
                    (0, response_1.default)(res, 201, { message: "profile photo has been changed", avatar: cloudImage.secure_url });
                }
            }
            else {
                fs_1.default.rm(newPath, () => { });
                (0, response_1.default)(res, 500, "avatar photo upload fail");
            }
        }
        catch (ex) {
            (0, response_1.default)(res, 500, "avatar photo upload fail");
        }
        finally {
            yield (client === null || client === void 0 ? void 0 : client.quit());
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
                    let client;
                    try {
                        let cloudImage = yield (0, cloudinary_1.uploadImage)(newPath);
                        client = yield (0, database_1.redisConnect)();
                        if (cloudImage.secure_url) {
                            let userStr = yield client.HGET("users", req.user_id);
                            let user = JSON.parse(userStr);
                            yield client.HSET("users", user.id, JSON.stringify(Object.assign(Object.assign({}, user), { cover: cloudImage.secure_url })));
                            if (user) {
                                fs_1.default.rm(newPath, () => { });
                                (0, response_1.default)(res, 201, { message: "cover photo has been changed", cover: cloudImage.secure_url });
                            }
                        }
                        else {
                            fs_1.default.rm(newPath, () => { });
                            (0, response_1.default)(res, 500, "cover photo upload fail");
                        }
                    }
                    catch (err) {
                        (0, errorConsole_1.default)(err);
                        (0, response_1.default)(res, 500, "cover  photo upload fail");
                    }
                    finally {
                        yield (client === null || client === void 0 ? void 0 : client.quit());
                    }
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
                            (0, response_1.default)(res, 201, { message: "markdown image upload complete", path: image.secure_url });
                        }
                        else {
                            fs_1.default.rm(newPath, () => { });
                            (0, response_1.default)(res, 500, "markdown image upload fail");
                        }
                    })
                        .catch(ex => {
                        (0, response_1.default)(res, 500, "markdown image upload fail");
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
const sendPasswordResetMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        // send a link and a secret code with expire date...
        let users = yield (0, redisUtils_1.getHashData)("users", client);
        const { to } = req.body;
        let findIndex = users.findIndex(u => u.email === to);
        if (findIndex === -1) {
            (0, response_1.default)(res, 404, "This email not registered yet");
            return;
        }
        let token = (0, jwt_1.createToken)(users[findIndex].id, users[findIndex].email, '30min');
        let info = yield (0, sendMail_1.default)({
            to: to,
            from: process.env.ADMIN_EMAIL,
            subject: "Change Password",
            html: `
        <div>
          <h1>Change Password Blogger application</h1>
            <a href="${process.env.FRONTEND}/auth/login/new-password/${token}">click to set new password</a>
          </div>
      `
        });
        if (info.messageId) {
            (0, response_1.default)(res, 201, { message: "Email has been send" });
        }
        else {
            (0, response_1.default)(res, 500, "internal error");
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        if (ex.message === "jwt expired") {
            (0, response_1.default)(res, 409, "session timeout");
        }
        else {
            (0, response_1.default)(res, 500, "Network error");
        }
    }
    finally {
        yield (client === null || client === void 0 ? void 0 : client.quit());
    }
});
exports.sendPasswordResetMail = sendPasswordResetMail;
const checkPasswordResetSessionTimeout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { token } = req.body;
    try {
        let s = yield (0, jwt_1.parseToken)(token);
        (0, response_1.default)(res, 200, "");
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        if (ex.message === "jwt expired") {
            (0, response_1.default)(res, 500, "password reset session expired");
        }
    }
});
exports.checkPasswordResetSessionTimeout = checkPasswordResetSessionTimeout;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { token, password } = req.body;
        client = yield (0, database_1.redisConnect)();
        // send a link and a secret code with expire date....
        // 1st check token validity.
        // 2. if token valid then reset password
        let { email, id } = yield (0, jwt_1.parseToken)(token);
        let userStr = yield client.HGET("users", id);
        if (userStr) {
            let user = JSON.parse(userStr);
            let { hash, err } = yield (0, hash_1.createHash)(password);
            if (!hash) {
                (0, errorConsole_1.default)(err);
                (0, response_1.default)(res, 500, "Password reset fail. Try again");
            }
            user.password = hash;
            let isPassChanged = yield client.HSET("users", user.id, JSON.stringify(user));
            if (isPassChanged || isPassChanged === 0) {
                let { password } = user, other = __rest(user, ["password"]);
                (0, response_1.default)(res, 201, Object.assign({ token: token }, other));
            }
            else {
                (0, response_1.default)(res, 500, "Password reset fail. Try again");
            }
        }
        else {
            (0, response_1.default)(res, 500, "Account not found");
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, ex.message ? ex.message : "Internal Error");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVycy9hdXRoQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJEQUFtQztBQUNuQyxnQ0FBK0M7QUFDL0MsMEVBQWtEO0FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUdsQywrRUFBdUQ7QUFDdkQsNENBQW9CO0FBQ3BCLDREQUFvQztBQUNwQyw4Q0FBMEM7QUFFMUMsbUdBQTJFO0FBQzNFLGtDQUFnRDtBQUNoRCx3REFBb0Q7QUFDcEQsMENBQXlDO0FBQ3pDLHFFQUE2QztBQUd0QyxNQUFNLGFBQWEsR0FBRyxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUU7SUFDbkQsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJO1FBQ0YsTUFBTSxHQUFHLE1BQU0sSUFBQSx1QkFBWSxHQUFFLENBQUE7UUFDN0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtRQUNyQixJQUFJLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtRQUN4RCxJQUFJLEtBQUssR0FBRyxNQUFNLElBQUEsd0JBQVcsRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDOUMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsRUFBRSxDQUFBLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUE7UUFDM0MsSUFBRyxJQUFJO1lBQUUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBQyxDQUFDLENBQUE7UUFFMUUsTUFBTSxFQUFDLEdB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