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
exports.cookieAdd = exports.getUser = exports.loginViaToken = exports.loginUser = exports.createNewUser = void 0;
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
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let date = new Date();
        let { first_name, last_name, email, password } = req.body;
        let user = db.get('users').find({ email: email }).value();
        if (user)
            return res.send("user already registered");
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
        if (ex.type === "VALIDATION_ERROR") {
            (0, response_1.default)(res, 422, ex.errors);
        }
        else if (ex.type === "ER_DUP_ENTRY") {
            (0, response_1.default)(res, 409, "user already exists");
        }
        else {
            next(ex);
        }
    }
});
exports.createNewUser = createNewUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let user = db.get('users').find({ email: email }).value();
        console.log(user);
        if (user) {
            let match = yield bcryptjs.compare(password, user.password);
            if (!match)
                return res.json({ message: "Password not match" });
            let token = yield (0, jwt_1.createToken)(user.id, user.email);
            let { password: s } = user, other = __rest(user, ["password"]);
            res.json(Object.assign({ token: token }, other));
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
            httpOnly: true,
            // Forces to use https in production
            secure: process.env.NODE_ENV === 'production'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvYXV0aENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsZ0NBQStDO0FBQy9DLDBFQUFrRDtBQUNsRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ25ELE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUE7QUFDdEQsTUFBTSxRQUFRLEdBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRXJDLHNFQUE4QztBQUM5QywrRUFBdUQ7QUFFaEQsTUFBTSxhQUFhLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFO0lBQ25ELElBQUk7UUFDRixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO1FBQ3JCLElBQUksRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO1FBQ3hELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDekQsSUFBRyxJQUFJO1lBQUUsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFFbkQsSUFBSSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUs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