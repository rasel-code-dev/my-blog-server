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
exports.getUser = exports.loginViaToken = exports.loginUser = exports.createNewUser = void 0;
const response_1 = __importDefault(require("../response"));
const jwt_1 = require("../jwt");
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const shortid = require("shortid");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('./src/database/db.json'));
const bcryptjs = require("bcryptjs");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvYXV0aENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsZ0NBQStDO0FBQy9DLDBFQUFrRDtBQUNsRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ25ELE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUE7QUFDdEQsTUFBTSxRQUFRLEdBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRzlCLE1BQU0sYUFBYSxHQUFHLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRTtJQUNuRCxJQUFJO1FBQ0YsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtRQUNyQixJQUFJLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtRQUN4RCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3pELElBQUcsSUFBSTtZQUFFLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1FBRW5ELElBQUksSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLFVBQVUs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