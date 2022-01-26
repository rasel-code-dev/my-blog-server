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
exports.getToken = exports.parseToken = exports.createToken = void 0;
const jwt = require('jsonwebtoken');
const createToken = (id, email, expiresIn) => {
    return jwt.sign({
        id: id,
        email: email,
    }, process.env.SECRET, { expiresIn: expiresIn ? expiresIn : '5h' });
};
exports.createToken = createToken;
const parseToken = (token) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (token) {
                let d = yield jwt.verify(token, process.env.SECRET);
                resolve(d);
            }
            else {
                reject(new Error("Token not found"));
            }
        }
        catch (ex) {
            reject(ex);
        }
    }));
};
exports.parseToken = parseToken;
const getToken = (req) => {
    return req.headers["authorization"];
};
exports.getToken = getToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJqd3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBRTVCLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFpQixFQUFDLEVBQUU7SUFDekQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1osRUFBRSxFQUFFLEVBQUU7UUFDTixLQUFLLEVBQUUsS0FBSztLQUNiLEVBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUM5RCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBUFksUUFBQSxXQUFXLGVBT3ZCO0FBR00sTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUMsRUFBRTtJQUNoQyxPQUFPLElBQUksT0FBTyxDQUE4QixDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUN2RSxJQUFJO1lBQ0YsSUFBRyxLQUFLLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUNuRCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDWDtpQkFBTTtnQkFDTixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFBO2FBQ3BDO1NBQ0Y7UUFBQyxPQUFPLEVBQUUsRUFBQztZQUNWLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUNYO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNMLENBQUMsQ0FBQTtBQWJZLFFBQUEsVUFBVSxjQWF0QjtBQUVNLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFDN0IsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ3JDLENBQUMsQ0FBQTtBQUZZLFFBQUEsUUFBUSxZQUVwQiJ9