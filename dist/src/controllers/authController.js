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
exports.makeDataBackup = exports.cookieAdd = exports.getUser = exports.loginViaToken = exports.loginUser = exports.createNewUser = void 0;
const response_1 = __importDefault(require("../response"));
const jwt_1 = require("../jwt");
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const shortid = require("shortid");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('./src/database/db.json'));
const bcryptjs = require("bcryptjs");
const visitorDB_1 = __importDefault(require("../database/visitorDB"));
const getAppCookies_1 = __importDefault(require("../utilities/getAppCookies"));
const makeZip_1 = __importDefault(require("../utilities/makeZip"));
const fs_1 = __importDefault(require("fs"));
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let date = new Date();
        let { first_name, last_name, email, password } = req.body;
        let user = db.get('users').find({ email: email }).value();
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
        db.get('users').push(newUser).write();
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
        let user = db.get('users').find({ email: email }).value();
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
            return (0, response_1.default)(res, null, "token not found");
        let { id, email } = yield (0, jwt_1.parseToken)(token);
        let user = db.get('users').find({ email: email }).value();
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
    let user = db.get('users').find({ username: username }).value();
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
    let backupFiles = ["database", "markdown"];
    let ii = 0;
    backupFiles.forEach((bkk, i) => {
        ii = ii + 1;
        (0, makeZip_1.default)(`./src/${bkk}`, `src/backup/${bkk}.zip`)
            .then(r => {
            if (backupFiles.length === ii) {
                (0, makeZip_1.default)(`src/backup`, `src/backup.zip`).then(rr => {
                    const stream = fs_1.default.createReadStream(__dirname + '/backup.zip');
                    stream.pipe(res);
                });
            }
        });
    });
});
exports.makeDataBackup = makeDataBackup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvYXV0aENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsZ0NBQStDO0FBQy9DLDBFQUFrRDtBQUNsRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ25ELE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUE7QUFDdEQsTUFBTSxRQUFRLEdBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRXJDLHNFQUE4QztBQUM5QywrRUFBdUQ7QUFDdkQsbUVBQTZDO0FBQzdDLDRDQUFvQjtBQUViLE1BQU0sYUFBYSxHQUFHLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRTtJQUNuRCxJQUFJO1FBQ0YsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtRQUNyQixJQUFJLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtRQUN4RCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3pELElBQUcsSUFBSTtZQUFFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUseUJB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