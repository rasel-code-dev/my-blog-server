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
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCompare = exports.createHash = void 0;
const bcryptjs = require("bcryptjs");
const createHash = (password) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let salt = yield bcryptjs.genSalt(10);
            let hashedPass = yield bcryptjs.hash(password, salt);
            resolve({ err: null, hash: hashedPass });
        }
        catch (ex) {
            resolve({ err: ex.message, hash: "" });
        }
    }));
};
exports.createHash = createHash;
const hashCompare = (password, hashPassword) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let m = yield bcryptjs.compare(password, hashPassword);
            resolve(m);
        }
        catch (ex) {
            resolve(null);
        }
    }));
};
exports.hashCompare = hashCompare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJoYXNoL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sUUFBUSxHQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUU5QixNQUFNLFVBQVUsR0FBRyxDQUFDLFFBQVEsRUFBQyxFQUFFO0lBQ3BDLE9BQU8sSUFBSSxPQUFPLENBQXNCLENBQU8sT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBQy9ELElBQUk7WUFDRixJQUFJLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEMsSUFBSSxVQUFVLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUNwRCxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFBO1NBQ3ZDO1FBQUMsT0FBTyxFQUFFLEVBQUM7WUFDVixPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTtTQUNyQztJQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFWWSxRQUFBLFVBQVUsY0FVdEI7QUFFTSxNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUMsRUFBRTtJQUNuRCxPQUFPLElBQUksT0FBTyxDQUFzQixDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUMvRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQTtZQUN0RCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDWDtRQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2Q7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBVFksUUFBQSxXQUFXLGVBU3ZCIn0=