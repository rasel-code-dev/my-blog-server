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
exports.changePassword = exports.checkPasswordResetSessionTimeout = exports.sendPasswordResetMail = exports.getAuthPassword = exports.uploadMarkdownImage = exports.uploadProfileCoverPhoto = exports.uploadProfilePhoto = exports.updateProfile = exports.cookieAdd = exports.getUserEmail = exports.getUser = exports.loginViaToken = exports.loginUser = exports.createNewUser = void 0;
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
const User_1 = __importDefault(require("../models/User"));
const mongodb_1 = require("mongodb");
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        let { first_name, last_name, email, password } = req.body;
        // let {c: User, client, db } = await mongoConnect("users")
        const { err, hash } = yield (0, hash_1.createHash)(password);
        let user = yield User_1.default.findOne({ email: email }, {});
        if (user) {
            (0, response_1.default)(res, 409, { message: "User Already exists" });
            return;
        }
        else {
            let newUser = new User_1.default({
                created_at: new Date(),
                updated_at: new Date(),
                avatar: "",
                first_name,
                last_name,
                email,
                password: hash
            });
            newUser = yield newUser.save();
            if (newUser) {
                let token = yield (0, jwt_1.createToken)(newUser._id, newUser.email);
                (0, response_1.default)(res, 201, Object.assign({ token: token }, newUser));
            }
            else {
                (0, response_1.default)(res, 500, "Please Try Again");
            }
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, {
            message: "Please Try Again",
            m: ex.message
        });
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
        client === null || client === void 0 ? void 0 : client.close();
    }
});
exports.loginUser = loginUser;
function loginUserHandler(email, password) {
    return new Promise((s, e) => __awaiter(this, void 0, void 0, function* () {
        let client;
        try {
            let { c: UserCollection, client: cc } = yield (0, database_1.mongoConnect)("users");
            client = cc;
            let user = yield UserCollection.findOne({ email: email }, {});
            if (user) {
                let match = yield (0, hash_1.hashCompare)(password, user.password);
                if (!match)
                    return e(new Error("Password not match"));
                let token = yield (0, jwt_1.createToken)(user._id, user.email);
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
            client === null || client === void 0 ? void 0 : client.close();
        }
    }));
}
const loginViaToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        let { c: UserCollection, client: cc } = yield (0, database_1.mongoConnect)("users");
        client = cc;
        let token = req.headers["token"];
        if (!token)
            return (0, response_1.default)(res, 404, "token not found");
        let { id, email } = yield (0, jwt_1.parseToken)(token);
        let user = yield UserCollection.findOne({ _id: new mongodb_1.ObjectId(id) }, {});
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
        client === null || client === void 0 ? void 0 : client.close();
    }
});
exports.loginViaToken = loginViaToken;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let client;
    try {
        let { c: UserCollection, client: cc } = yield (0, database_1.mongoConnect)("users");
        client = cc;
        let user = yield UserCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        let { password, role } = user, o = __rest(user, ["password", "role"]);
        (0, response_1.default)(res, 200, { user: o });
    }
    catch (ex) {
    }
    finally {
        client === null || client === void 0 ? void 0 : client.close();
    }
});
exports.getUser = getUser;
const getUserEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    let client;
    try {
        let { c: UserCollection, client: cc } = yield (0, database_1.mongoConnect)("users");
        client = cc;
        let user = yield UserCollection.findOne({ email: email });
        if (user) {
            (0, response_1.default)(res, 200, { user: { avatar: user.avatar } });
        }
        else {
            (0, response_1.default)(res, 404, "This email not yet registered");
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, "");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.close();
    }
});
exports.getUserEmail = getUserEmail;
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
    try {
        let user = User_1.default.findOne({ _id: new mongodb_1.ObjectId(req.user_id) }, {});
        if (user) {
            const { username, first_name, about_you, last_name, email, oldPassword, newPassword } = req.body;
            if (oldPassword && newPassword) {
                let match = yield (0, hash_1.hashCompare)(oldPassword, user.password);
                if (!match) {
                    return (0, response_1.default)(res, 409, { message: "current password doesn't match" });
                }
                let { err, hash } = yield (0, hash_1.createHash)(newPassword);
                user.password = hash;
                if (err) {
                    return (0, response_1.default)(res, 500, { message: err });
                }
            }
            if (about_you) {
                user.description = about_you;
            }
            if (username) {
                // user.username = username
            }
            if (first_name) {
                user.first_name = first_name;
            }
            if (last_name) {
                user.last_name = last_name;
            }
            if (email) {
                user.email = email;
            }
            let doc = yield User_1.default.update({ _id: new mongodb_1.ObjectId(req.user_id) }, {
                $set: user
            });
            if (doc) {
                return (0, response_1.default)(res, 201, {
                    user: Object.assign(Object.assign({}, user), { password: newPassword }),
                    message: "Operation completed"
                });
            }
            else {
                return (0, response_1.default)(res, 409, {
                    message: "Operation fail"
                });
            }
        }
    }
    catch (ex) {
        return (0, response_1.default)(res, 500, {
            message: "Operation fail"
        });
    }
    finally {
    }
});
exports.updateProfile = updateProfile;
const uploadProfilePhoto = (req, res, next) => {
    const form = (0, formidable_1.default)({ multiples: false });
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
                let user = yield User_1.default.findOne({ _id: new mongodb_1.ObjectId(req.user_id) }, {});
                let isUpdated = yield User_1.default.update({ _id: user._id }, { $set: { avatar: cloudImage.secure_url } });
                if (isUpdated) {
                    fs_1.default.rm(newPath, () => { });
                    (0, response_1.default)(res, 201, { message: "profile photo has been changed", avatar: cloudImage.secure_url });
                }
                else {
                    (0, response_1.default)(res, 500, "avatar upload fail");
                }
            }
            else {
                fs_1.default.rm(newPath, () => { });
                (0, response_1.default)(res, 500, "avatar upload fail");
            }
        }
        catch (ex) {
            (0, errorConsole_1.default)(ex);
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
            (0, response_1.default)(res, 500, "cover photo upload fail");
            return;
        }
        if (files && files.cover) {
            let tempDir = files.cover.filepath.replace(files.cover.newFilename, '');
            let newPath = tempDir + files.cover.originalFilename;
            fs_1.default.rename(files.cover.filepath, newPath, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (!err) {
                    try {
                        let user = yield User_1.default.findOne({ _id: new mongodb_1.ObjectId(req.user_id) }, {});
                        if (user) {
                            let cloudImage = yield (0, cloudinary_1.uploadImage)(newPath);
                            if (cloudImage.secure_url) {
                                let isUpdated = yield User_1.default.update({ _id: user._id }, { $set: { cover: cloudImage.secure_url } });
                                if (isUpdated) {
                                    fs_1.default.rm(newPath, () => { });
                                    (0, response_1.default)(res, 201, { message: "cover photo has been changed", cover: cloudImage.secure_url });
                                }
                                else {
                                    fs_1.default.rm(newPath, () => { });
                                    (0, response_1.default)(res, 500, "cover photo upload fail");
                                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVycy9hdXRoQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJEQUFtQztBQUNuQyxnQ0FBK0M7QUFDL0MsMEVBQWtEO0FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUdsQywrRUFBdUQ7QUFDdkQsNENBQW9CO0FBQ3BCLDREQUFvQztBQUNwQyw4Q0FBMEM7QUFFMUMsbUdBQTJFO0FBQzNFLGtDQUFnRDtBQUNoRCx3REFBb0Q7QUFDcEQsMENBQXVEO0FBQ3ZELHFFQUE2QztBQUM3QywwREFBa0M7QUFDbEMscUNBQWlDO0FBRzFCLE1BQU0sYUFBYSxHQUFHLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRTtJQUNuRCxJQUFJLE1BQU0sQ0FBQztJQUVYLElBQUk7UUFDRixJQUFJLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtRQUN4RCwyREFBMkQ7UUFFM0QsTUFBTSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsR0FBRyxNQUFNLElBQUEsaUJBQVUsRUFBQyxRQUFRLENBQUMsQ0FBQTtRQUU5QyxJQUFJLElBQUksR0FBRyxNQUFNLGNBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDakQsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBQyxDQUFDLENBQUE7WUFDcEQsT0FBTTtTQUNQO2FBQU07WUFDTCxJQUFJLE9BQU8sR0FBUSxJQUFJLGNBQUksQ0FBQztnQkFDMUIsVUFB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